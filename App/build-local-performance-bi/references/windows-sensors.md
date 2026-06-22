# Windows Sensor Notes

Use this reference when adapting or debugging the generated performance BI widget.

## Metric Sources

- CPU utilization: Node `os.cpus()` deltas across all logical cores.
- Memory usage: Node `os.totalmem()` and `os.freemem()`.
- GPU utilization: Windows GPU Performance Counters, first through `Win32_PerfFormattedData_GPUPerformanceCounters_GPUEngine`, then `Get-Counter '\GPU Engine(*)\Utilization Percentage'`.
- CPU temperature: Prefer LibreHardwareMonitor/OpenHardwareMonitor WMI namespaces; fall back to `root\wmi:MSAcpi_ThermalZoneTemperature`.

## Expected Limitations

CPU temperature is not guaranteed on stock Windows. Many systems do not expose package/core temperature through WMI without a hardware monitor provider. The UI must display `--°C` and continue updating other metrics when temperature is unavailable.

GPU counters may be missing on older Windows builds, remote sessions, disabled GPUs, or driver-specific setups. The UI must display `--%` until data appears.

## Portability Checklist

1. Confirm Windows 10/11 or adapt the app for the target OS.
2. Confirm Node.js LTS and npm are available, or use the Codex bundled runtime if available in the current environment.
3. Run the scaffolder from this skill, then run `npm install`.
4. Run `npm run check`.
5. Run a one-shot sampler from `src/metrics.js` and verify it returns JSON without throwing.
6. Start the app with `npm start` once.
7. Create a desktop shortcut with `scripts/create-shortcut.ps1`.
8. Start via the `.lnk` and verify no visible PowerShell window remains attached.

## One-Shot Sampler Test

```powershell
@'
const { createSystemSampler } = require('./src/metrics');
(async () => {
  const sampler = createSystemSampler();
  console.log(JSON.stringify(sampler.sample(), null, 2));
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(JSON.stringify(sampler.sample(), null, 2));
})();
'@ | node -
```
