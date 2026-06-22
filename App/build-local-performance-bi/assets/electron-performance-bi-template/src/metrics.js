const os = require('node:os');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);

function snapshotCpuTimes() {
  return os.cpus().map((cpu) => ({ ...cpu.times }));
}

function totalCpuTime(times) {
  return Object.values(times).reduce((sum, value) => sum + value, 0);
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

async function runPowerShell(script, timeout = 3500) {
  const { stdout } = await execFileAsync(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script],
    {
      timeout,
      windowsHide: true,
      maxBuffer: 1024 * 256
    }
  );

  return stdout.trim();
}

function parseNumber(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value).replace(',', '.').match(/-?\d+(\.\d+)?/);
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

class SystemSampler {
  constructor() {
    this.previousCpuTimes = snapshotCpuTimes();
    this.lastGpu = null;
    this.lastGpuAt = 0;
    this.pendingGpu = null;
    this.lastTemperature = null;
    this.lastTemperatureAt = 0;
    this.pendingTemperature = null;
  }

  readCpuUsage() {
    const current = snapshotCpuTimes();
    let idleDelta = 0;
    let totalDelta = 0;

    for (let index = 0; index < current.length; index += 1) {
      const currentTimes = current[index];
      const previousTimes = this.previousCpuTimes[index] || currentTimes;
      idleDelta += currentTimes.idle - previousTimes.idle;
      totalDelta += totalCpuTime(currentTimes) - totalCpuTime(previousTimes);
    }

    this.previousCpuTimes = current;

    if (totalDelta <= 0) {
      return 0;
    }

    return round(clamp((1 - idleDelta / totalDelta) * 100));
  }

  readMemoryUsage() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    return {
      percent: round(clamp((used / total) * 100)),
      usedGb: round(used / 1024 ** 3, 1),
      totalGb: round(total / 1024 ** 3, 1)
    };
  }

  refreshGpuUsage() {
    const now = Date.now();
    if (this.pendingGpu || (this.lastGpu !== null && now - this.lastGpuAt < 2500)) {
      return;
    }

    const script = `
$ErrorActionPreference = 'SilentlyContinue'
$value = $null
$gpuEngines = Get-CimInstance -Namespace root\\cimv2 -ClassName Win32_PerfFormattedData_GPUPerformanceCounters_GPUEngine
if ($gpuEngines) {
  $value = ($gpuEngines | Where-Object { $_.Name -match 'engtype_(3D|Compute|Copy|VideoDecode|VideoEncode)' } | Measure-Object -Property UtilizationPercentage -Sum).Sum
}
if ($null -eq $value) {
  $samples = (Get-Counter '\\GPU Engine(*)\\Utilization Percentage').CounterSamples
  if ($samples) {
    $value = ($samples | Where-Object { $_.InstanceName -match 'engtype_(3D|Compute|Copy|VideoDecode|VideoEncode)' } | Measure-Object -Property CookedValue -Sum).Sum
  }
}
if ($null -ne $value) {
  [math]::Round([math]::Min(100, [math]::Max(0, $value)), 1)
}`;

    this.pendingGpu = runPowerShell(script)
      .then((output) => {
        const value = parseNumber(output);
        this.lastGpu = value === null ? null : round(clamp(value));
        this.lastGpuAt = Date.now();
      })
      .catch(() => {
        this.lastGpu = null;
        this.lastGpuAt = Date.now();
      })
      .finally(() => {
        this.pendingGpu = null;
      });
  }

  readGpuUsage() {
    this.refreshGpuUsage();
    return this.lastGpu;
  }

  refreshCpuTemperature() {
    const now = Date.now();
    if (
      this.pendingTemperature ||
      (this.lastTemperature !== null && now - this.lastTemperatureAt < 5000)
    ) {
      return;
    }

    const script = `
$ErrorActionPreference = 'SilentlyContinue'
$temps = @()
$namespaces = @('root\\LibreHardwareMonitor', 'root\\OpenHardwareMonitor')
foreach ($ns in $namespaces) {
  $temps += Get-CimInstance -Namespace $ns -ClassName Sensor |
    Where-Object {
      $_.SensorType -eq 'Temperature' -and
      ($_.Name -match 'CPU|Core|Package|Tctl|Tdie')
    } |
    Select-Object -ExpandProperty Value
}
if (-not $temps -or $temps.Count -eq 0) {
  $temps += Get-CimInstance -Namespace root\\wmi -ClassName MSAcpi_ThermalZoneTemperature |
    ForEach-Object { ($_.CurrentTemperature / 10) - 273.15 } |
    Where-Object { $_ -gt 0 -and $_ -lt 130 }
}
if ($temps -and $temps.Count -gt 0) {
  [math]::Round(($temps | Measure-Object -Average).Average, 1)
}`;

    this.pendingTemperature = runPowerShell(script)
      .then((output) => {
        const value = parseNumber(output);
        this.lastTemperature = value === null ? null : round(value);
        this.lastTemperatureAt = Date.now();
      })
      .catch(() => {
        this.lastTemperature = null;
        this.lastTemperatureAt = Date.now();
      })
      .finally(() => {
        this.pendingTemperature = null;
      });
  }

  readCpuTemperature() {
    this.refreshCpuTemperature();
    return this.lastTemperature;
  }

  sample() {
    const memory = this.readMemoryUsage();

    return {
      cpu: this.readCpuUsage(),
      temperature: this.readCpuTemperature(),
      memory: memory.percent,
      memoryText: `${memory.usedGb}/${memory.totalGb} GB`,
      gpu: this.readGpuUsage(),
      timestamp: new Date().toISOString()
    };
  }
}

function createSystemSampler() {
  return new SystemSampler();
}

module.exports = {
  createSystemSampler
};
