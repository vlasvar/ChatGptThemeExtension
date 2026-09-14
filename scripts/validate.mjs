import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const required = [
  "manifest.json",
  "content/content.js",
  "content/content.css",
  "popup/popup.html",
  "popup/popup.js",
  "popup/popup.css",
  "themes/themes.json",
  "LICENSE"
];

const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));

const assertFile = async (file, source) => {
  if (!file || file.includes("*")) return;
  await access(path.join(root, file)).catch(() => {
    throw new Error(`${source} references missing file: ${file}`);
  });
};

for (const file of required) await access(path.join(root, file));

const manifest = await readJson("manifest.json");
const registry = await readJson("themes/themes.json");

await assertFile(manifest.action?.default_popup, "action.default_popup");
for (const [size, icon] of Object.entries(manifest.action?.default_icon || {})) {
  await assertFile(icon, `action.default_icon.${size}`);
}
for (const [size, icon] of Object.entries(manifest.icons || {})) {
  await assertFile(icon, `icons.${size}`);
}
for (const [index, script] of (manifest.content_scripts || []).entries()) {
  for (const file of script.js || []) await assertFile(file, `content_scripts[${index}].js`);
  for (const file of script.css || []) await assertFile(file, `content_scripts[${index}].css`);
}

if (manifest.manifest_version !== 3) throw new Error("manifest_version must be 3");
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error("Version must use x.y.z format");
if (!Array.isArray(registry.themes) || registry.themes.length === 0) throw new Error("At least one theme is required");

const ids = new Set();
for (const theme of registry.themes) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(theme.id)) throw new Error(`Invalid theme id: ${theme.id}`);
  if (ids.has(theme.id)) throw new Error(`Duplicate theme id: ${theme.id}`);
  ids.add(theme.id);
  await access(path.join(root, theme.wallpaper));
  await access(path.join(root, theme.mark));
}

console.log(`SkinShift ${manifest.version}: ${registry.themes.length} themes validated.`);
