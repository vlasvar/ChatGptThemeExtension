# Chrome Web Store submission brief

Prepared for SkinShift `0.7.0`. This document is a submission aid, not a legal certification. Re-check the dashboard fields and current policies immediately before submission, and have the owner confirm the final copy, privacy URL, account details, and terms acceptance.

## Listing basics

- **Name:** SkinShift
- **Short description:** Local-only visual themes for ChatGPT, with one-click switching and no tracking.
- **Category:** Productivity (recommended; the extension changes the appearance of a productivity application).
- **Language:** English (the extension UI and store copy are English; Greek landing-page copy is supplemental).
- **Website:** https://aislop.gr/experiments/skinshift/
- **Support URL:** https://aislop.gr/experiments/skinshift/privacy/
- **Privacy-policy URL:** https://aislop.gr/experiments/skinshift/privacy/
- **Repository:** https://github.com/vlasvar/skinshift
- **Release:** https://github.com/vlasvar/skinshift/releases/tag/v0.7.0

## Short description

Local-only visual themes for ChatGPT, with one-click switching and no tracking.

## Detailed description

Make ChatGPT yours with SkinShift, an open-source Chrome extension that adds three original visual themes: Nebula, Neon Vice, and Noir Signal.

Choose a theme from the compact popup, enable or pause the styling at any time, and keep using ChatGPT normally. SkinShift only applies packaged CSS and artwork to ChatGPT pages. It does not rebuild ChatGPT, change routing, send messages, access account data, or read conversation content.

Privacy is the point: the selected theme and enabled state stay in local browser storage. There is no account, backend, analytics, advertising, remote code, or third-party data transfer.

SkinShift is independent, MIT-licensed, and not affiliated with or endorsed by OpenAI. ChatGPT is a trademark of OpenAI. Theme artwork in this release is original to the project.

## Privacy-practices answers

Use these answers only after comparing them with the final uploaded ZIP and dashboard wording:

1. **Does the extension collect or transmit user data?** No.
2. **Does it sell user data or use it for advertising?** No.
3. **Does it use remote code?** No. All JavaScript, CSS, registry data, and artwork are packaged with the extension.
4. **What is stored?** The selected theme ID and enabled/disabled preference in `chrome.storage.local`.
5. **Where is data transferred?** Nowhere. The extension has no network client or server endpoint. `fetch()` is used only for the packaged `themes/themes.json` registry through `chrome.runtime.getURL()`.
6. **Limited Use certification:** The extension does not collect, transmit, sell, or use user data for advertising. The owner must review and certify the final dashboard declaration.

## Permission justifications

- **`storage`:** Saves the user's selected theme and enabled/disabled preference locally so the choice persists between ChatGPT visits.
- **`https://chatgpt.com/*` and `https://chat.openai.com/*`:** Limits the packaged stylesheet and content script to ChatGPT pages, where the user asked SkinShift to change the visual presentation.

No broader host access, tabs permission, scripting permission, account permission, or network permission is needed by the current code.

## Graphic assets

The dashboard currently asks for a 128×128 store icon, at least one 1280×800 screenshot (up to five), a YouTube demonstration link, a 440×280 small promo tile, and a 1400×560 marquee tile. The final asset set belongs in `marketing/assets/` and must be checked for:

- only original SkinShift artwork and sanitized demo state;
- no real conversations, names, account details, or company information;
- legibility at the displayed size;
- truthful UI and theme behaviour;
- PNG or JPEG for store graphics where required.

## Testing instructions for reviewers

1. Install the ZIP through Chrome's extension developer flow or load the unpacked extension root.
2. Open `https://chatgpt.com/` and refresh the page.
3. Open the SkinShift toolbar popup.
4. Select Nebula, Neon Vice, and Noir Signal; confirm the page backdrop and accent change.
5. Toggle SkinShift off and confirm the ChatGPT page returns to its normal surface.
6. Toggle it on again and confirm the selected theme is restored.
7. Check a composer, sidebar, menu, dialog, and narrow window width.
8. Confirm the popup's "Make a theme" link opens the contribution guide.

## Owner submission checklist

- [ ] Confirm the final ZIP and screenshots contain no private or third-party material.
- [ ] Confirm the support and privacy URLs are live and accurate.
- [ ] Create or select the Chrome Web Store developer account.
- [ ] Complete the dashboard privacy-practices form against the uploaded ZIP.
- [ ] Add the final store graphics and demonstration video URL.
- [ ] Review Chrome Web Store policies and developer agreement.
- [ ] Submit the item only after explicit owner approval.
- [ ] Record the item URL and publish it into the README and Aislop page.
