# Public Dependency Summary

This skill builds a local Windows desktop performance BI widget from a bundled Electron template. It contains no user account, network, host, serial, or device-specific configuration. All paths are resolved at runtime from the chosen output folder or the current user's desktop through standard OS APIs.

## Capability Summary

- Scaffold a compact floating desktop performance dashboard.
- Show CPU utilization, CPU temperature, memory usage, and GPU utilization.
- Use a frameless transparent Electron window with always-on-top behavior.
- Keep normal launching terminal-free through a desktop shortcut that targets Electron directly.
- Continue running when optional sensors are unavailable by showing placeholder values.

## Runtime Dependencies

- Windows 10 or Windows 11.
- Node.js LTS and npm for installing and running the Electron app.
- Electron, declared in the template `package.json` as a development dependency.
- PowerShell for optional GPU counter sampling, temperature sensor sampling, and shortcut creation.
- Python 3 for running `scripts/scaffold_performance_bi.py`.

## Optional Sensor Providers

- LibreHardwareMonitor or OpenHardwareMonitor can improve CPU temperature availability.
- Windows ACPI thermal zones are used only as a fallback and are not guaranteed to expose CPU package temperature.
- Windows GPU Performance Counters are used for GPU utilization and may be unavailable on some Windows builds, remote sessions, disabled GPU setups, or driver-specific configurations.

## Privacy And Portability Notes

- Do not commit generated `node_modules/`, logs, local screenshots, machine inventory, or runtime metric samples.
- Do not hard-code usernames, desktop paths, LAN IP addresses, host names, hardware serials, GPU model names, CPU model names, Wi-Fi names, or organization-specific paths.
- Keep generated examples generic and use placeholders such as `<output-folder>` or `<path-to-this-skill>`.
- If a user provides real telemetry or screenshots, redact identifying system details before adding them to the repository.

## Template Contents

- `package.json`: npm scripts and Electron dependency declaration.
- `src/main.js`: Electron window lifecycle, placement, IPC handlers, and polling loop.
- `src/metrics.js`: CPU, memory, GPU, and temperature sampling.
- `src/preload.js`: context-isolated renderer bridge.
- `src/renderer.js`: metric cards, sparklines, live/preview state, and window controls.
- `src/styles.css`: compact floating glass UI.
- `scripts/create-shortcut.ps1`: Windows shortcut creation without a persistent foreground shell.

