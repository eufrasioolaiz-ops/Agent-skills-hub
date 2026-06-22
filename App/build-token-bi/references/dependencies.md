# Public Dependency Summary

This skill builds a local Windows desktop Token BI widget from a bundled Electron template. The published skill does not include login information, cookies, saved sessions, diagnostics output, account identifiers, real balances, or generated dependencies.

## Capability Summary

- Scaffold a compact floating Token BI dashboard.
- Monitor provider web-console pages through local Electron sessions.
- Show plan usage, quota reset hints, expiry reminders, balance, and spend summaries when the provider pages expose those values.
- Let the user authenticate manually inside provider windows; the app never asks for passwords in its own UI.
- Refresh on startup, on a timer, and on manual request.

## Runtime Dependencies

- Windows 10 or Windows 11.
- Node.js LTS and npm.
- Electron, declared in the template `package.json`.
- PowerShell for optional shortcut creation.
- Python 3 for running `scripts/scaffold_token_bi.py`.

## Provider Dependencies

- MiniMax console usage and plan pages.
- MiMo Token Plan management page.
- DeepSeek usage page.
- Provider page structure, route names, labels, and localization may change and require parser maintenance.

## Privacy Boundaries

- Do not commit `node_modules/`, `diagnostics/`, Electron user data folders, browser profile data, cookies, local storage, screenshots, or runtime snapshots.
- Do not hard-code usernames, emails, phone numbers, passwords, API keys, cookies, bearer tokens, session IDs, balance values, renewal dates, host names, LAN addresses, or device identifiers.
- Keep examples as clearly fake placeholders.
- If diagnostics are needed for debugging, sanitize them locally and delete them before packaging.

## Template Contents

- `package.json`: npm scripts and Electron dependency declaration.
- `src/main.js`: Electron window lifecycle, refresh scheduling, IPC handlers, and headless diagnostic entry points.
- `src/token-monitor.js`: provider sessions, hidden page capture, parsing rules, and login-window handling.
- `src/preload.js`: context-isolated renderer bridge.
- `src/renderer.js`: dashboard rendering, tabs, status states, and manual refresh actions.
- `src/styles.css`: compact glass-style floating UI.
- `scripts/create-shortcut.ps1`: Windows shortcut creation.
- `scripts/diagnose-capture.js`: local-only diagnostic capture helper.

