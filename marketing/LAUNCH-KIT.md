# SkinShift launch kit

SkinShift is a small, honest product: a local-only open-source extension that gives ChatGPT three original visual themes without touching conversations or account data.

## Core positioning

**One-sentence pitch:** Make ChatGPT yours with three original, local-only visual themes — no tracking, no backend, no conversation access.

**Short description:** SkinShift is an open-source Manifest V3 extension for Chrome-family browsers that adds Nebula, Neon Vice, and Noir Signal to ChatGPT, with one-click switching and a local enable/disable control.

**Long description:** ChatGPT is useful, but its default atmosphere does not have to be permanent. SkinShift applies a restrained visual layer to ChatGPT pages and lets you switch between three original themes from a compact popup. The project does not rebuild ChatGPT, change routing, send messages, access account data, or read conversation content. Settings remain in local browser storage; there is no account, backend, analytics, advertising, remote code, or third-party transfer. It is an independent MIT-licensed project, not affiliated with or endorsed by OpenAI.

## Channel copy

### Facebook — Greek, playful

Το ChatGPT σου, αλλά με λίγο περισσότερο χαρακτήρα. ✨

Το SkinShift είναι ένα μικρό open-source extension για Chrome/Edge/Brave/Arc που αλλάζει την ατμόσφαιρα του ChatGPT με τρία original themes: Nebula, Neon Vice και Noir Signal.

Δεν έχει λογαριασμό, tracking ή backend. Δεν πειράζει τα μηνύματα και δεν διαβάζει τις συνομιλίες σου — κρατά μόνο την επιλογή θέματος τοπικά στον browser.

Κατέβασέ το από το GitHub, δοκίμασέ το και αν έχεις ιδέα για τέταρτο theme, άνοιξε ένα pull request. Το καλύτερο theme μπορεί να είναι το δικό σου. 🚀

🔗 https://github.com/vlasvar/skinshift/releases/tag/v0.7.0

### LinkedIn — professional

I’m releasing SkinShift, an open-source Manifest V3 extension that adds three original visual themes to ChatGPT: Nebula, Neon Vice and Noir Signal.

The product is deliberately small and local-first: no account, backend, analytics, advertising, remote code or conversation access. A compact popup handles theme selection and enable/disable state; preferences stay in local browser storage.

The repository includes the validator, contribution guide, security policy and a data-driven theme registry. If you build an original theme, the contribution path is intentionally one folder, one registry entry and one pull request.

Try the v0.7.0 release and tell me what should come next: https://github.com/vlasvar/skinshift/releases/tag/v0.7.0

### X — concise thread

1/ ChatGPT, new skin. SkinShift is an open-source Chrome-family extension with 3 original themes: Nebula, Neon Vice, Noir Signal.

2/ Local-only by design: no tracking, backend, remote code or conversation access. Pick a theme, pause it anytime, keep using ChatGPT normally.

3/ Try v0.7.0: https://github.com/vlasvar/skinshift/releases/tag/v0.7.0

Got a theme idea? Contributions welcome: https://github.com/vlasvar/skinshift/blob/main/CONTRIBUTING.md

### Reddit — non-spammy introduction

**Title:** I made a small open-source extension for local ChatGPT themes (SkinShift)

I wanted a visual change for ChatGPT without building a wrapper or sending anything to another service, so I made SkinShift. It adds three original themes — Nebula, Neon Vice and Noir Signal — with a small popup for switching and pausing the styling.

The extension is Manifest V3 and only asks for local storage plus ChatGPT host access. It does not read conversation content, use analytics, or connect to a backend. I’ve included the validator, contribution guide and security policy in the repo.

This is an early release, so ChatGPT UI changes may still cause selector breakage. Feedback about readability, composer visibility, menus, dialogs and narrow layouts is especially useful. Please follow each community’s self-promotion rules before posting.

Release: https://github.com/vlasvar/skinshift/releases/tag/v0.7.0

### DEV.to article outline

1. Why a visual layer instead of a ChatGPT wrapper
2. The product boundary: CSS, packaged theme registry, local settings
3. Manifest V3 permissions and what the extension deliberately does not do
4. Designing three original themes for readable surfaces, dialogs and composer
5. Building a contribution format that is easy to review
6. Testing the risky parts: UI drift, disabled state, popup persistence and narrow layouts
7. What I’m measuring after launch: installs, active users, contributions and referrals
8. Invitation: submit a theme with original artwork and a short description

## Evidence status

The social preview and three theme assets are ready. A real browser recording and clean 1280×800 screenshots are still pending a sanitized Chromium capture; do not describe the current preview image as a live demo or upload private ChatGPT content.

## Suggested launch sequence

1. Verify the extension and working ZIP.
2. Publish GitHub release `v0.7.0`.
3. Publish the README demonstration and social preview.
4. Publish the Aislop Experiments page and privacy/support page.
5. Prepare and owner-review the Chrome Web Store listing.
6. Submit to the Chrome Web Store only after owner approval.
7. After the store route is live, post the Greek Facebook launch, professional LinkedIn post, X thread, relevant Reddit introduction, and DEV.to article in separate, community-appropriate windows.
8. Reply to early reports and turn the first strong theme contribution into a follow-up release.

## Community-theme invitation

Build a new theme from the existing registry: add `wallpaper.webp` and `mark.png` or `mark.svg` under `themes/your-theme/`, add the colors and paths to `themes/themes.json`, run `node scripts/validate.mjs`, and open a pull request. Use original artwork only; do not submit trademarks, copyrighted characters, scraped promotional material, or screenshots containing private conversations.

## Suggested attachments

| Channel | Attachment |
|---|---|
| GitHub README/release | `marketing/assets/social-preview-1280x640.png`, then the real `demo.gif` and three clean 1280×800 theme screenshots after capture |
| Aislop | `marketing/assets/social-preview-1280x640.png`, then the real demo GIF after capture |
| Chrome Web Store | 128×128 icon, 1–5 1280×800 screenshots, 440×280 small promo tile, 1400×560 marquee tile, and a short hosted demo video |
| Facebook | `marketing/assets/social-preview-1280x640.png` or a single clean theme screenshot |
| LinkedIn | social preview plus the 15–20 second demo GIF/video |
| X | a theme screenshot for the first post, then the demo GIF on the release post |
| Reddit | one clean screenshot or the GIF, with no more than the context needed to explain the project |
| DEV.to | the demo GIF plus one screenshot showing the popup and one showing the themed page |

## UTM convention

Use the same keys everywhere: `utm_source`, `utm_medium`, `utm_campaign`, and optional `utm_content`.

Example release URL:

`https://github.com/vlasvar/skinshift/releases/tag/v0.7.0?utm_source=linkedin&utm_medium=social&utm_campaign=skinshift-v070&utm_content=launch-post`

For Aislop links, use the page as the landing point and keep the campaign slug stable: `skinshift-v070`. Do not add UTM parameters to the canonical URL or store the parameters in the extension.

## Thirty-day measurement plan

Prioritise outcomes in this order: successful installs, active users, GitHub stars, theme contributions, then backlinks/referral traffic.

| Window | Measure | Decision |
|---|---|---|
| Days 0–3 | ZIP downloads, store installs if live, demo completion, install-route failures | Fix installation friction and broken links first |
| Days 4–7 | Active users, enable/disable use, theme selection mix, issue reports | Improve readability or selectors only where evidence shows a problem |
| Days 8–14 | Returning users, release upgrades, GitHub stars, contribution-guide clicks | Make the contribution path more obvious; do not add gamification |
| Days 15–21 | Pull requests, theme submissions, referral sessions from Aislop | Review contributor feedback and document accepted theme patterns |
| Days 22–30 | Active-user retention, repeat installs, backlinks, referral quality, support questions | Choose between a compatibility patch, one community-theme release, or more documentation |

Record a baseline before promotion. Avoid adding analytics to SkinShift just to measure the launch; use platform-native aggregate counters and voluntary, privacy-respecting referral measurement where available.
