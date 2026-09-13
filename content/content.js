(() => {
  "use strict";

  const STORAGE_KEY = "skinshift.settings";
  const DEFAULT_SETTINGS = Object.freeze({ enabled: true, theme: "nebula" });
  const root = document.documentElement;
  let themes = [];

  async function loadThemes() {
    const response = await fetch(chrome.runtime.getURL("themes/themes.json"));
    if (!response.ok) throw new Error(`Unable to load themes (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.themes) || data.themes.length === 0) {
      throw new Error("Theme registry is empty");
    }
    return data.themes;
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
    const enabled = settings.enabled !== false;
    const selected = themes.find((theme) => theme.id === settings.theme) || themes[0];

    root.classList.toggle("skinshift-enabled", enabled);
    root.dataset.skinshiftTheme = selected.id;
    root.style.setProperty("--ss-wallpaper", `url("${chrome.runtime.getURL(selected.wallpaper)}")`);
    root.style.setProperty("--ss-accent", selected.accent);
    root.style.setProperty("--ss-accent-soft", selected.accentSoft);
    root.style.setProperty("--ss-overlay", selected.overlay);

    const backdrop = ensureBackdrop();
    backdrop.hidden = !enabled;
  }

  async function readSettings() {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    return { ...DEFAULT_SETTINGS, ...(stored[STORAGE_KEY] || {}) };
  }

  async function initialize() {
    try {
      themes = await loadThemes();
      applyTheme(await readSettings());
    } catch (error) {
      console.error("[SkinShift] Initialization failed:", error);
      root.classList.remove("skinshift-enabled");
    }
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes[STORAGE_KEY] || themes.length === 0) return;
    applyTheme({ ...DEFAULT_SETTINGS, ...(changes[STORAGE_KEY].newValue || {}) });
  });

  initialize();
})();
