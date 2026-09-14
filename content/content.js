(() => {
  "use strict";

  const STORAGE_KEY = "skinshift.settings";
  const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    theme: "nebula",
    sidebarMarks: false,
    projectAccents: {},
    projectSubtitles: {}
  });
  const ACCENTS = {
    cyan: "#5ce1ff",
    blue: "#43b7ff",
    violet: "#a76bff",
    magenta: "#ff5ecb",
    ember: "#ff7a4d",
    gold: "#ffb347",
    green: "#3dff8a",
    black: "#141414"
  };
  const SKIP = new Set([
    "chatgpt", "new chat", "images", "library", "projects", "plugins",
    "scheduled", "sora", "explore", "more", "search", "chats", "pinned",
    "home", "recents", "tasks", "show more", "upgrade plan", "personalization",
    "profile", "settings", "help", "log out", "logout", "plus"
  ]);

  const root = document.documentElement;
  let themes = [];
  let settingsCache = { ...DEFAULT_SETTINGS };
  let observer = null;
  let decorateTimer = null;
  let hookedHistory = false;

  async function loadThemes() {
    const response = await fetch(chrome.runtime.getURL("themes/themes.json"));
    if (!response.ok) throw new Error(`Unable to load themes (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.themes) || data.themes.length === 0) throw new Error("Theme registry is empty");
    return data.themes;
  }

  function currentTheme() {
    return themes.find((theme) => theme.id === settingsCache.theme) || themes[0];
  }

  function textOf(el) {
    return (el?.innerText || el?.textContent || "").replace(/\s+/g, " ").trim();
  }

  function cleanName(el) {
    return textOf(el)
      .replace(/\b(pinned|project|projects|show more|upgrade plan|updated)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isJunkName(name) {
    const lower = (name || "").toLowerCase();
    if (!lower || SKIP.has(lower) || /\bupdated\b/.test(lower)) return true;
    for (const skip of SKIP) if (lower === skip || lower.startsWith(`${skip} `)) return true;
    return false;
  }

  function sidebarRoot() {
    return document.getElementById("stage-slideover-sidebar");
  }

  function hrefOf(el) {
    return el?.getAttribute?.("href") || el?.href || "";
  }

  function isConversationHref(href) {
    return /\/c\/[a-z0-9-]{8,}/i.test(href || "");
  }

  function isProjectHref(href) {
    const value = href || "";
    return /\/g\/g-p-/i.test(value) || /\/projects?\//i.test(value) || /\/project(\/|$|\?|#)/i.test(value);
  }

  function sectionLabel(el) {
    const raw = textOf(el).replace(/[▾▼]/g, "").trim().toLowerCase();
    return ["projects", "pinned", "chats"].includes(raw) ? raw : "";
  }

  function findHeading(label) {
    const sidebar = sidebarRoot();
    if (!sidebar) return null;
    return [...sidebar.querySelectorAll("h2, h3, div, span")].find((el) => {
      if (el.children.length > 2) return false;
      return sectionLabel(el) === label;
    }) || null;
  }

  function itemsAfterHeading(heading, stopLabels) {
    const sidebar = sidebarRoot();
    if (!sidebar || !heading) return [];
    const nodes = [...sidebar.querySelectorAll("a[href], a, [data-sidebar-item], h2, h3, div, span")];
    const out = [];
    let live = false;
    for (const node of nodes) {
      if (node === heading) {
        live = true;
        continue;
      }
      if (!live) continue;
      const label = sectionLabel(node);
      if (label && stopLabels.includes(label)) break;
      if (!node.matches("a, [data-sidebar-item]")) continue;
      if (node.closest("#stage-sidebar-tiny-bar, #sidebar-header")) continue;
      const name = cleanName(node);
      if (!name || name.length > 48 || isJunkName(name)) continue;
      out.push(node);
    }
    return out;
  }

  function titleRowsOnly(elements) {
    const usable = elements.filter((el) => !isConversationHref(hrefOf(el)));
    if (!usable.length) return [];
    const lefts = usable.map((el) => el.getBoundingClientRect().left).filter((left) => left > 0);
    if (!lefts.length) return usable;
    const minLeft = Math.min(...lefts);
    return usable.filter((el) => el.getBoundingClientRect().left <= minLeft + 14);
  }

  function collectMarks() {
    const empty = { rows: [], projects: [], pinned: [] };
    const sidebar = sidebarRoot();
    if (!sidebar) return empty;

    const byHref = [...sidebar.querySelectorAll("a[href]")].filter((link) => {
      if (link.closest("#stage-sidebar-tiny-bar, #sidebar-header")) return false;
      if (!isProjectHref(hrefOf(link)) || isConversationHref(hrefOf(link))) return false;
      const parentLink = link.parentElement?.closest("a[href]");
      if (parentLink && parentLink !== link && isProjectHref(hrefOf(parentLink))) return false;
      const name = cleanName(link);
      return name && !isJunkName(name);
    });
    const fromProjects = titleRowsOnly(itemsAfterHeading(findHeading("projects"), ["pinned", "chats"]));
    const fromPinned = titleRowsOnly(itemsAfterHeading(findHeading("pinned"), ["projects", "chats"]));

    const pack = (elements, kind) => {
      const seen = new Map();
      for (const element of elements) {
        const name = cleanName(element);
        if (name && !seen.has(name)) seen.set(name, { name, el: element, kind });
      }
      return [...seen.values()];
    };
    const projects = pack([...byHref, ...fromProjects], "project");
    const pinned = pack(fromPinned, "pinned");
    return {
      rows: [...projects, ...pinned.filter((item) => !projects.some((project) => project.name === item.name))],
      projects: projects.map((item) => item.name),
      pinned: pinned.map((item) => item.name)
    };
  }

  function hashedAccentKey(name) {
    const keys = Object.keys(ACCENTS);
    let hash = 0;
    for (let index = 0; index < name.length; index += 1) hash = (hash << 5) - hash + name.charCodeAt(index);
    return keys[Math.abs(hash) % keys.length];
  }

  function assignedAccentKey(name) {
    const key = settingsCache.projectAccents?.[name];
    if (key === "none") return null;
    return key && ACCENTS[key] ? key : hashedAccentKey(name);
  }

  function accentHex(name) {
    return ACCENTS[assignedAccentKey(name)] || ACCENTS.cyan;
  }

  function persistAutoAccents(names) {
    const next = { ...(settingsCache.projectAccents || {}) };
    let changed = false;
    for (const name of names) {
      if (!next[name]) {
        next[name] = hashedAccentKey(name);
        changed = true;
      }
    }
    if (!changed) return;
    settingsCache.projectAccents = next;
    chrome.storage.local.set({ [STORAGE_KEY]: settingsCache });
  }

  function unstyleRow(row) {
    row.classList.remove("skinshift-marked-row");
    delete row.dataset.skinshiftTitle;
    delete row.dataset.skinshiftKind;
    row.style.removeProperty("--ss-row-accent");
    row.querySelectorAll(":scope .ss-agent-mark, :scope .ss-agent-sub").forEach((node) => node.remove());
  }

  function clearStyledRows() {
    sidebarRoot()?.querySelectorAll(".skinshift-marked-row").forEach(unstyleRow);
  }

  function styleProject(name, element, kind) {
    const selected = currentTheme();
    if (!selected || assignedAccentKey(name) === null) return;
    const row = element.closest("a, [data-sidebar-item]") || element;
    if (!row || row.closest("#stage-sidebar-tiny-bar") || isConversationHref(hrefOf(row))) return;
    const parentLink = row.parentElement?.closest("a[href]");
    if (parentLink && parentLink !== row && isProjectHref(hrefOf(parentLink))) return;

    row.classList.add("skinshift-marked-row");
    row.dataset.skinshiftTitle = name;
    row.dataset.skinshiftKind = kind || "project";
    row.style.setProperty("--ss-row-accent", accentHex(name));

    const markSource = chrome.runtime.getURL(selected.mark);
    const existing = row.querySelector(":scope .ss-agent-avatar");
    if (existing) {
      existing.src = markSource;
    } else if (!row.querySelector(":scope .ss-agent-mark")) {
      const mark = document.createElement("span");
      mark.className = "ss-agent-mark";
      const image = document.createElement("img");
      image.className = "ss-agent-avatar";
      image.alt = "";
      image.src = markSource;
      mark.append(image);
      const icon = row.querySelector(":scope .icon");
      if (icon) icon.prepend(mark);
      else row.insertBefore(mark, row.firstChild);
    }

    if (!row.querySelector(":scope .ss-agent-sub")) {
      const label = [...row.querySelectorAll("div, span")].find((node) => node.children.length === 0 && cleanName(node) === name);
      const host = label?.parentElement || row;
      const subtitle = document.createElement("div");
      subtitle.className = "ss-agent-sub";
      const dot = document.createElement("span");
      dot.className = "ss-agent-dot";
      subtitle.append(dot, document.createTextNode(settingsCache.projectSubtitles?.[name] || (kind === "pinned" ? "Pinned" : "Project")));
      host.append(subtitle);
    }
  }

  function decorateUI() {
    if (!root.classList.contains("skinshift-enabled") || !settingsCache.sidebarMarks) {
      clearStyledRows();
      return;
    }
    const found = collectMarks();
    persistAutoAccents([...found.projects, ...found.pinned]);
    const sidebar = sidebarRoot();
    if (!sidebar) return;

    sidebar.querySelectorAll(".skinshift-marked-row").forEach((row) => {
      const match = found.rows.find((item) => item.el === row || row.contains(item.el));
      if (!match || assignedAccentKey(match.name) === null) unstyleRow(row);
    });
    found.rows.forEach(({ name, el, kind }) => {
      if (assignedAccentKey(name) !== null) styleProject(name, el, kind);
      else if (el.classList?.contains("skinshift-marked-row") || el.closest?.(".skinshift-marked-row")) {
        unstyleRow(el.classList.contains("skinshift-marked-row") ? el : el.closest(".skinshift-marked-row"));
      }
    });
    chrome.storage.local.set({ detectedProjects: found.projects, detectedPinned: found.pinned });
  }

  function ensureBackdrop() {
    let backdrop = document.getElementById("skinshift-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "skinshift-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      root.append(backdrop);
    }
    return backdrop;
  }

  function applyTheme(settings) {
    settingsCache = {
      ...DEFAULT_SETTINGS,
      ...settings,
      projectAccents: { ...(settings?.projectAccents || {}) },
      projectSubtitles: { ...(settings?.projectSubtitles || {}) }
    };
    const enabled = settingsCache.enabled !== false;
    const selected = currentTheme();
    if (!selected) return;

    root.classList.toggle("skinshift-enabled", enabled);
    root.dataset.skinshiftTheme = selected.id;
    root.style.setProperty("--ss-wallpaper", `url("${chrome.runtime.getURL(selected.wallpaper)}")`);
    root.style.setProperty("--ss-accent", selected.accent);
    root.style.setProperty("--ss-accent-soft", selected.accentSoft);
    root.style.setProperty("--ss-overlay", selected.overlay);
    ensureBackdrop().hidden = !enabled;
    if (enabled) decorateUI();
    else clearStyledRows();
  }

  function scheduleDecorate() {
    clearTimeout(decorateTimer);
    decorateTimer = setTimeout(decorateUI, 120);
  }

  function hookNavigation() {
    if (hookedHistory) return;
    hookedHistory = true;
    const wrap = (method) => function wrappedHistory() {
      const result = method.apply(this, arguments);
      scheduleDecorate();
      setTimeout(decorateUI, 250);
      setTimeout(decorateUI, 800);
      return result;
    };
    history.pushState = wrap(history.pushState.bind(history));
    history.replaceState = wrap(history.replaceState.bind(history));
    window.addEventListener("popstate", scheduleDecorate);
  }

  function startObserver() {
    observer?.disconnect();
    observer = new MutationObserver(scheduleDecorate);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function readSettings() {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    return { ...DEFAULT_SETTINGS, ...(stored[STORAGE_KEY] || {}) };
  }

  async function initialize() {
    try {
      themes = await loadThemes();
      applyTheme(await readSettings());
      startObserver();
      hookNavigation();
    } catch (error) {
      console.error("[SkinShift] Initialization failed:", error);
      root.classList.remove("skinshift-enabled");
    }
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes[STORAGE_KEY] || themes.length === 0) return;
    applyTheme({ ...DEFAULT_SETTINGS, ...(changes[STORAGE_KEY].newValue || {}) });
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "VA_APPLY_SETTINGS") {
      applyTheme(message.settings);
      sendResponse({ ok: true });
    }
    if (message?.type === "VA_GET_PROJECTS") {
      const found = collectMarks();
      sendResponse({ projects: found.projects, pinned: found.pinned });
    }
    return true;
  });

  initialize();
})();
