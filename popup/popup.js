"use strict";

const STORAGE_KEY = "skinshift.settings";
const DEFAULT_SETTINGS = Object.freeze({ enabled: true, theme: "nebula" });
const themesContainer = document.getElementById("themes");
const enabledInput = document.getElementById("enabled");
const status = document.getElementById("status");
const template = document.getElementById("theme-template");
let settings = { ...DEFAULT_SETTINGS };
let themes = [];

async function saveSettings(nextSettings, message) {
  settings = { ...settings, ...nextSettings };
  await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  renderSelection();
  status.textContent = message;
}

function renderSelection() {
  enabledInput.checked = settings.enabled;
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
  } catch (error) {
    console.error("[SkinShift] Popup failed:", error);
    status.textContent = "SkinShift could not load. Reload the extension and try again.";
  }
}

enabledInput.addEventListener("change", () => {
  saveSettings({ enabled: enabledInput.checked }, enabledInput.checked ? "SkinShift enabled." : "SkinShift paused.");
});

initialize();
