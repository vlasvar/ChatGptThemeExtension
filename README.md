# SkinShift

### Make ChatGPT yours.

Open-source visual themes for ChatGPT — local-only, with no tracking, no backend, and no access to your conversations.

[Download the latest release](https://github.com/vlasvar/skinshift/releases/latest) · [Create a theme](CONTRIBUTING.md) · [Explore more at aislop.gr](https://aislop.gr)

![SkinShift Nebula theme](themes/nebula/wallpaper.webp)

## Why SkinShift?

ChatGPT is useful. Its default interface does not have to be your only option. SkinShift changes the visual atmosphere while leaving ChatGPT's routing, messages, account, and features untouched.

- **Three original themes:** Nebula, Neon Vice, and Noir Signal
- **One-click switching** from a compact extension popup
- **Privacy by design:** settings remain in local browser storage
- **Minimal permissions:** `storage` plus access to ChatGPT pages only
- **Open theme format:** one folder, one registry entry, one pull request
- **Chromium support:** Chrome, Edge, Brave, and Arc

| Nebula | Neon Vice | Noir Signal |
|---|---|---|
| ![Nebula](themes/nebula/wallpaper.webp) | ![Neon Vice](themes/neon-vice/wallpaper.webp) | ![Noir Signal](themes/noir-signal/wallpaper.webp) |

## Install

### Release download

1. Download `skinshift-v*.zip` from [Releases](https://github.com/vlasvar/skinshift/releases).
2. Unzip it.
3. Open `chrome://extensions` or `edge://extensions`.
4. Enable **Developer mode**.
5. Select **Load unpacked** and choose the folder containing `manifest.json`.
6. Open or refresh [ChatGPT](https://chatgpt.com), then choose a theme from the SkinShift icon.

### From source

Clone or download this repository and load the repository root as an unpacked extension. Run `node scripts/validate.mjs` before testing a change.

## How privacy works

SkinShift does not read, collect, transmit, or sell conversation data. It does not use analytics, remote code, advertising, accounts, or a server. The selected theme and enabled state are stored locally through Chrome's `storage` API.

| Permission | Purpose |
|---|---|
| `storage` | Remember the selected theme and enabled state locally |
| `chatgpt.com` / `chat.openai.com` | Apply the packaged stylesheet and wallpaper on ChatGPT |

You can verify every runtime file in this repository.

## Build a community theme

Each theme lives in its own directory:

```text
themes/
  your-theme/
    wallpaper.webp
    mark.svg
```

Add its colors and asset paths to `themes/themes.json`, then open a pull request. The validator checks theme IDs, referenced files, icons, and the extension manifest. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full checklist.

## Stability

ChatGPT's interface can change without notice. SkinShift uses restrained CSS overrides, but a UI update can still cause visual breakage. Disable the extension and refresh the page if that happens, then file a sanitized [bug report](https://github.com/vlasvar/skinshift/issues/new/choose).

## Project

SkinShift is an independent open-source experiment by [Vlassis Varelas](https://github.com/vlasvar). More practical experiments about AI, software, and the wonderfully messy future live at [aislop.gr](https://aislop.gr).

SkinShift is not affiliated with or endorsed by OpenAI. ChatGPT is a trademark of OpenAI. The included theme artwork is original to this project.

## License

[MIT](LICENSE)
