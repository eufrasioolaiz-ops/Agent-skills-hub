---
name: build-token-bi
description: Build a local Windows desktop Token BI widget as a compact floating Electron app for monitoring AI service plan usage, quota reset hints, expiry reminders, and balance or spend summaries through user-owned browser sessions. Use when Codex is asked to scaffold, package, debug, sanitize, or adapt a local Token BI dashboard for MiniMax, MiMo, DeepSeek, or similar web-console token plan monitoring.
---

# Build Token BI

## Overview

Create a runnable local Token BI widget from the bundled Electron template. The app opens provider login pages in local Electron session partitions, reads web-console page text, parses quota or balance fields, and renders a small always-on-top dashboard.

## Privacy First

Never package or upload login state, cookies, session storage, diagnostics output, screenshots, account identifiers, balances from a real account, or generated `node_modules`. The template must contain code and generic placeholders only.

## Quick Start

Use the scaffold script instead of copying files by hand:

```powershell
$skill = "<path-to-this-skill>"
python "$skill\scripts\scaffold_token_bi.py" `
  "C:\path\to\TokenBI" `
  --install `
  --shortcut
```

If `npm` is missing, install Node.js LTS and rerun with `--install`. First launch requires the user to log in manually inside the local Electron windows opened by the app.

## Workflow

1. Confirm the target OS and output directory.
   - This template targets Windows 10/11.
   - Ask before overwriting a non-empty output directory.

2. Scaffold from the bundled template.
   - Run `scripts/scaffold_token_bi.py <output>`.
   - Use `--install --shortcut` when Node/npm and network access are available.

3. Validate the generated app.
   - Run `npm run check`.
   - Start with `npm start`.
   - Use the platform buttons to open login windows and let the user authenticate manually.

4. Handle web-console drift.
   - If a provider changes its route or page labels, update parsing rules in `src/token-monitor.js`.
   - Keep parser changes generic and do not paste raw account pages into committed files.

5. Keep diagnostics local.
   - `npm run diagnose` and `npm run snapshot` may write local runtime captures under `diagnostics/`.
   - Treat those files as private and never upload them.

## Resource Guide

- `scripts/scaffold_token_bi.py`: copy the template, optionally run `npm install`, and optionally create a Windows desktop shortcut.
- `assets/electron-token-bi-template/`: runnable Electron app template.
- `references/dependencies.md`: public dependency summary and privacy boundaries.
- `references/provider-parsing.md`: provider routes, parsing strategy, and maintenance notes.

## Completion Criteria

Report the generated project path, whether dependencies installed, whether `npm run check` passed, whether the app launched, which providers require login, and whether any diagnostics or local session data were kept out of the packaged skill.

