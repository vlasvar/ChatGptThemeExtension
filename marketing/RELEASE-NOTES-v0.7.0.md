# SkinShift v0.7.0

SkinShift is a fresh, local-only relaunch of the ChatGPT visual-theme extension.

## Included

- Three original themes: Nebula, Neon Vice, and Noir Signal.
- One-click theme switching from the extension popup.
- Local enable/disable control.
- A data-driven theme registry for community contributions.
- A minimal permission surface: local storage and ChatGPT host access only.
- Manifest V3 source, validation, contribution guidance, and security policy.

## Privacy

SkinShift has no account, backend, analytics, advertising, remote code, or third-party data transfer. The selected theme and enabled state are stored locally with Chrome's `storage` API. The extension does not read or modify conversation content.

## Known limitations

ChatGPT's interface can change without notice. Selector coverage is intentionally restrained, but a future ChatGPT UI update may require a follow-up compatibility patch. See [SECURITY.md](../SECURITY.md) and [CONTRIBUTING.md](../CONTRIBUTING.md) for reporting guidance.

SkinShift is an independent project and is not affiliated with or endorsed by OpenAI.
