# Contributing to SkinShift

Small, focused pull requests are easiest to review. Bug fixes, selector updates, accessibility improvements, and original themes are welcome.

## Add a theme

1. Create `themes/your-theme/`.
2. Add `wallpaper.webp` (wide, compressed, and readable behind white text).
3. Add `mark.png` or `mark.svg` (original square artwork with no external resources).
4. Add one entry to `themes/themes.json` that conforms to `themes/schema.json`.
5. Run `node scripts/validate.mjs`.
6. Test the unpacked extension on `chatgpt.com` in a supported Chromium browser.

Please do not submit trademarks, copyrighted characters, scraped promotional artwork, or screenshots containing private conversations. By contributing, you confirm that the submitted material can be distributed under the MIT License.

## Report breakage

ChatGPT's interface changes frequently. Include the browser, SkinShift version, the affected page or layout, and minimal reproduction steps. Sanitize screenshots before attaching them.
