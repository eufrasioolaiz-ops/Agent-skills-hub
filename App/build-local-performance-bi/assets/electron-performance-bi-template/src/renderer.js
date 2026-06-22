const metricConfig = [
  {
    id: 'cpu',
    label: 'CPU',
    unit: '%',
    accent: '#27d9ff',
    icon: 'cpu',
    subLabel: 'Processor load'
  },
  {
    id: 'temperature',
    label: 'TEMP',
    unit: '°C',
    accent: '#49f0a8',
    icon: 'temp',
    subLabel: 'CPU package'
  },
  {
    id: 'memory',
    label: 'RAM',
    unit: '%',
    accent: '#7c8cff',
    icon: 'memory',
    subLabel: 'Memory usage'
  },
  {
    id: 'gpu',
    label: 'GPU',
    unit: '%',
    accent: '#4df0ff',
    icon: 'gpu',
    subLabel: 'Graphics load'
  }
];

const fallbackMetrics = {
  cpu: 42,
  temperature: 62,
  memory: 68,
  memoryText: '10.9/16.0 GB',
  gpu: 37,
  timestamp: new Date().toISOString(),
  preview: true
};

const history = new Map(metricConfig.map((metric) => [metric.id, []]));
const grid = document.querySelector('#metrics-grid');
const clock = document.querySelector('#clock');
const sampleState = document.querySelector('#sample-state');
const hardwareNote = document.querySelector('#hardware-note');

function iconTemplate(icon) {
  const icons = {
    cpu: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="2"></rect>
        <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"></path>
      </svg>`,
    temp: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z"></path>
        <path d="M12 17v-5"></path>
      </svg>`,
    memory: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="7" width="16" height="10" rx="2"></rect>
        <path d="M7 4v3M11 4v3M15 4v3M19 10h2M19 14h2M7 17v3M11 17v3M15 17v3M3 10h2M3 14h2"></path>
      </svg>`,
    gpu: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="6" width="13" height="12" rx="2"></rect>
        <path d="M17 10h3v4h-3M8 10h5v4H8zM7 3v3M11 3v3M7 18v3M11 18v3"></path>
      </svg>`
  };

  return icons[icon] || icons.cpu;
}

function createMetricCard(metric) {
  const card = document.createElement('article');
  card.className = 'metric-card';
  card.dataset.metric = metric.id;
  card.style.setProperty('--accent', metric.accent);
  card.innerHTML = `
    <div class="metric-glow"></div>
    <div class="metric-head">
      <span class="metric-icon">${iconTemplate(metric.icon)}</span>
      <span class="metric-label">${metric.label}</span>
    </div>
    <div class="metric-body">
      <div class="value-wrap">
        <span class="metric-value">--</span>
        <span class="metric-unit">${metric.unit}</span>
      </div>
      <svg class="radial" viewBox="0 0 52 52" aria-hidden="true">
        <circle class="radial-track" cx="26" cy="26" r="20"></circle>
        <circle class="radial-value" cx="26" cy="26" r="20"></circle>
      </svg>
    </div>
    <div class="metric-foot">
      <span class="metric-sub">${metric.subLabel}</span>
      <svg class="sparkline" viewBox="0 0 88 20" preserveAspectRatio="none" aria-hidden="true">
        <polyline points=""></polyline>
      </svg>
    </div>
  `;

  return card;
}

function pushHistory(id, value) {
  const values = history.get(id);
  if (!values || value === null || Number.isNaN(value)) {
    return;
  }

  values.push(value);
  if (values.length > 18) {
    values.shift();
  }
}

function sparklinePoints(values) {
  if (!values.length) {
    return '';
  }

  const width = 88;
  const height = 20;
  const step = values.length === 1 ? 0 : width / (values.length - 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - (Math.max(0, Math.min(100, value)) / 100) * (height - 3) - 1.5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function formatMetric(metric, metrics) {
  const rawValue = metrics[metric.id];
  if (rawValue === null || rawValue === undefined || Number.isNaN(rawValue)) {
    return {
      display: '--',
      value: null,
      detail: metric.id === 'temperature' ? 'Sensor unavailable' : metric.subLabel
    };
  }

  return {
    display: Math.round(rawValue).toString(),
    value: Number(rawValue),
    detail: metric.id === 'memory' && metrics.memoryText ? metrics.memoryText : metric.subLabel
  };
}

function renderMetrics(metrics) {
  let missingSensors = false;

  metricConfig.forEach((metric) => {
    const card = grid.querySelector(`[data-metric="${metric.id}"]`);
    if (!card) {
      return;
    }

    const formatted = formatMetric(metric, metrics);
    if (formatted.value === null) {
      missingSensors = true;
    }

    pushHistory(metric.id, formatted.value);

    card.querySelector('.metric-value').textContent = formatted.display;
    card.querySelector('.metric-sub').textContent = formatted.detail;

    const radial = card.querySelector('.radial-value');
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const progress = formatted.value === null ? 0 : Math.max(0, Math.min(100, formatted.value));
    radial.style.strokeDasharray = `${circumference}`;
    radial.style.strokeDashoffset = `${circumference * (1 - progress / 100)}`;

    card.querySelector('.sparkline polyline').setAttribute(
      'points',
      sparklinePoints(history.get(metric.id))
    );
  });

  sampleState.textContent = metrics.preview ? 'PREVIEW' : 'LIVE';
  hardwareNote.textContent = missingSensors
    ? 'Some Windows sensors are unavailable'
    : 'Sensors active';
}

function renderClock() {
  clock.textContent = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
}

function bootstrap() {
  metricConfig.forEach((metric) => {
    grid.appendChild(createMetricCard(metric));
  });

  renderClock();
  renderMetrics(fallbackMetrics);
  setInterval(renderClock, 1000);

  const api = window.performanceBI;
  if (!api) {
    setInterval(() => {
      const now = Date.now() / 1000;
      renderMetrics({
        cpu: 38 + Math.sin(now * 1.5) * 12,
        temperature: 58 + Math.sin(now * 0.6) * 5,
        memory: 66 + Math.sin(now * 0.4) * 4,
        memoryText: 'Preview mode',
        gpu: 22 + Math.cos(now * 1.3) * 15,
        timestamp: new Date().toISOString(),
        preview: true
      });
    }, 1000);
    return;
  }

  api.readNow().then(renderMetrics).catch(() => renderMetrics(fallbackMetrics));
  api.onMetrics(renderMetrics);

  document.querySelector('#minimize-button').addEventListener('click', () => api.minimize());
  document.querySelector('#close-button').addEventListener('click', () => api.close());
}

bootstrap();
