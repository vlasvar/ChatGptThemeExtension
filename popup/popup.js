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
const themesContainer = document.getElementById("themes");
const enabledInput = document.getElementById("enabled");
const sidebarMode = document.getElementById("sidebarMode");
const sidebarMarks = document.getElementById("sidebarMarks");
const status = document.getElementById("status");
const template = document.getElementById("theme-template");
const projects = document.getElementById("projects");
const pinned = document.getElementById("pinned");
const projectCount = document.getElementById("projectCount");
const pinnedCount = document.getElementById("pinnedCount");
let settings = { ...DEFAULT_SETTINGS };
let themes = [];

async function saveSettings(nextSettings, message) {
  settings = {
    ...settings,
    ...nextSettings,
    projectAccents: { ...(nextSettings.projectAccents || settings.projectAccents || {}) },
    projectSubtitles: { ...(nextSettings.projectSubtitles || settings.projectSubtitles || {}) }
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  await applyToActiveTab(settings);
  renderSelection();
  status.textContent = message;
}

async function applyToActiveTab(nextSettings) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs[0]?.id) return;
  try {
    await chrome.tabs.sendMessage(tabs[0].id, { type: "VA_APPLY_SETTINGS", settings: nextSettings });
  } catch (_error) {}
}

function hashedAccentKey(name) {
  const keys = Object.keys(ACCENTS);
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) hash = (hash << 5) - hash + name.charCodeAt(index);
  return keys[Math.abs(hash) % keys.length];
}

function renderSelection() {
  enabledInput.checked = settings.enabled !== false;
  sidebarMode.value = settings.sidebarMarks ? "marks" : "wallpaper";
  sidebarMarks.hidden = !settings.sidebarMarks;
  for (const button of themesContainer.querySelectorAll(".theme-card")) {
    const selected = button.dataset.theme === settings.theme;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  }
}

function renderThemes() {
  themesContainer.replaceChildren();
  for (const theme of themes) {
    const fragment = template.content.cloneNode(true);
    const button = fragment.querySelector("button");
    const preview = fragment.querySelector(".theme-preview");
    button.dataset.theme = theme.id;
    button.style.setProperty("--card-accent", theme.accent);
    preview.style.backgroundImage = `linear-gradient(${theme.overlay}, ${theme.overlay}), url("${chrome.runtime.getURL(theme.wallpaper)}")`;
    fragment.querySelector("strong").textContent = theme.name;
    fragment.querySelector("small").textContent = theme.description;
    button.addEventListener("click", () => saveSettings({ theme: theme.id, enabled: true }, `${theme.name} applied.`));
    themesContainer.append(fragment);
  }
  renderSelection();
}

function appendSwatches(row, name) {
  const swatches = document.createElement("div");
  swatches.className = "swatches";
  const chosen = settings.projectAccents?.[name] || hashedAccentKey(name);
  const none = document.createElement("button");
  none.className = `swatch none${chosen === "none" ? " active" : ""}`;
  none.dataset.key = "none";
  none.title = "None";
  swatches.append(none);
  for (const [key, hex] of Object.entries(ACCENTS)) {
    const swatch = document.createElement("button");
    swatch.className = `swatch${chosen === key ? " active" : ""}`;
    swatch.dataset.key = key;
    swatch.title = key;
    swatch.style.background = hex;
    swatches.append(swatch);
  }
  swatches.querySelectorAll(".swatch").forEach((button) => {
    button.addEventListener("click", async () => {
      settings.projectAccents = { ...(settings.projectAccents || {}), [name]: button.dataset.key };
      await saveSettings({ projectAccents: settings.projectAccents }, `${name}: ${button.dataset.key}.`);
      renderLists(lastPinned, lastProjects);
    });
  });
  row.append(swatches);
}

let lastPinned = [];
let lastProjects = [];

function fillGroup(host, names) {
  host.replaceChildren();
  if (!names.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "None visible on this tab.";
    host.append(empty);
    return;
  }
  const selectedTheme = themes.find((theme) => theme.id === settings.theme) || themes[0];
  for (const name of names) {
    const row = document.createElement("div");
    row.className = "project";
    const image = document.createElement("img");
    image.src = chrome.runtime.getURL(selectedTheme.mark);
    image.alt = "";
    const meta = document.createElement("div");
    meta.className = "meta";
    const title = document.createElement("div");
    title.className = "name";
    title.textContent = name;
    meta.append(title);
    row.append(image, meta);
    appendSwatches(meta, name);
    host.append(row);
  }
}

function renderLists(nextPinned, nextProjects) {
  lastPinned = [...new Set(nextPinned || [])].sort((a, b) => a.localeCompare(b));
  lastProjects = [...new Set(nextProjects || [])].sort((a, b) => a.localeCompare(b));
  pinnedCount.textContent = String(lastPinned.length);
  projectCount.textContent = String(lastProjects.length);
  fillGroup(pinned, lastPinned);
  fillGroup(projects, lastProjects);
}

async function loadProjects() {
  const local = await chrome.storage.local.get({ detectedProjects: [], detectedPinned: [] });
  let foundProjects = local.detectedProjects || [];
  let foundPinned = local.detectedPinned || [];
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      const response = await chrome.tabs.sendMessage(tabs[0].id, { type: "VA_GET_PROJECTS" });
      if (response?.projects) foundProjects = response.projects;
      if (response?.pinned) foundPinned = response.pinned;
    }
  } catch (_error) {}
  renderLists(foundPinned, foundProjects);
}

async function initialize() {
  try {
    const [registryResponse, stored] = await Promise.all([
      fetch(chrome.runtime.getURL("themes/themes.json")),
      chrome.storage.local.get(STORAGE_KEY)
    ]);
    if (!registryResponse.ok) throw new Error("Unable to load the theme registry");
    const registry = await registryResponse.json();
    themes = registry.themes;
    settings = { ...DEFAULT_SETTINGS, ...(stored[STORAGE_KEY] || {}) };
    renderThemes();
    await loadProjects();
  } catch (error) {
    console.error("[SkinShift] Popup failed:", error);
    status.textContent = "SkinShift could not load. Reload the extension and try again.";
  }
}

enabledInput.addEventListener("change", () => {
  saveSettings({ enabled: enabledInput.checked }, enabledInput.checked ? "SkinShift enabled." : "SkinShift paused.");
});

sidebarMode.addEventListener("change", () => {
  const enabled = sidebarMode.value === "marks";
  saveSettings({ sidebarMarks: enabled }, enabled ? "Icons + wallpaper enabled." : "Wallpaper-only mode enabled.");
});

initialize();
