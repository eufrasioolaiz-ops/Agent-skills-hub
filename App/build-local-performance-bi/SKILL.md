---
name: build-local-performance-bi
description: Build a local Windows desktop performance monitor BI widget as a compact floating glassmorphism Electron app with real-time CPU utilization, CPU temperature, memory usage, GPU utilization, desktop shortcut creation, and no persistent foreground PowerShell window. Use when Codex is asked to make, scaffold, package, debug, or port a local PC performance dashboard, monitoring widget, small floating BI panel, system resource overlay, or shortcut-launched desktop monitor.
---

# Build Local Performance BI

## Overview

Create a runnable local performance-monitor BI widget from the bundled Electron template. Prefer the scaffold script for repeatability, then validate system metrics and shortcut behavior on the target machine.

## Quick Start

Use the scaffold script instead of rewriting the app from scratch:

```powershell
$skill = "<path-to-this-skill>"
python "$skill\scripts\scaffold_performance_bi.py" `
  "C:\path\to\性能BI" `
  --install `
  --shortcut
```

In Codex, resolve `<path-to-this-skill>` from the loaded skill path. If `python` is not on PATH, use the Codex bundled Python when available. If `npm` is missing, install Node.js LTS or use an available runtime, then rerun with `--install`.

## Workflow

1. Confirm the target OS and directory.
   - This template targets Windows 10/11.
   - Ask before overwriting a non-empty target directory, or use a fresh folder.

2. Scaffold from the bundled template.
   - Run `scripts/scaffold_performance_bi.py <output>`.
   - Use `--install --shortcut` when Node/npm and network access are available.
   - Use `--force` only after confirming overwrites are acceptable.

3. Validate the generated app.
   - Run `npm run check`.
   - Run the one-shot sampler from `references/windows-sensors.md`.
   - Start with `npm start` once and close the test process.

4. Make daily launch terminal-free.
   - Prefer `scripts/create-shortcut.ps1`; it points the `.lnk` directly at `node_modules\electron\dist\electron.exe`.
   - Verify the shortcut launches `electron.exe`, not `npm start`, and does not leave a visible PowerShell window.

5. Explain sensor caveats.
   - CPU and memory should work from Node.
   - GPU may take a few seconds to populate.
   - CPU temperature may show `--°C` unless LibreHardwareMonitor/OpenHardwareMonitor or a compatible ACPI source is available.

## Design And Implementation Rules

- Keep the primary UI as a small horizontal floating window.
- Preserve the four requested metrics unless the user asks for more: CPU, TEMP, RAM, GPU.
- Keep the app usable when a sensor is unavailable; show `--` for that metric and continue updating the rest.
- Do not require a foreground shell for normal launch.
- Use an Electron frameless transparent window for glassmorphism, drag support, always-on-top behavior, and reliable desktop shortcut launch.
- Keep metric collection in the Electron main process and expose data through preload IPC.
- Avoid extra services or admin requirements unless the user explicitly asks for deeper hardware telemetry.

## Resources

- `scripts/scaffold_performance_bi.py`: copy the template, optionally install dependencies, and optionally create the shortcut.
- `assets/electron-performance-bi-template/`: runnable Electron app template.
- `references/dependencies.md`: public dependency summary and sanitized implementation notes.
- `references/windows-sensors.md`: Windows metric sources, limitations, and validation commands.

## Completion Criteria

Report the generated project path, whether `npm install` completed, whether `npm run check` passed, which metrics returned on the target machine, the shortcut path, and whether a shortcut launch leaves no visible PowerShell window.
