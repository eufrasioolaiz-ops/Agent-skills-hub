const { app, BrowserWindow, session } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { PLATFORMS } = require('../src/token-monitor');

const OUTPUT_DIR = path.join(__dirname, '..', 'diagnostics');
const TARGETS = ['mimo', 'deepseek'];
const WAIT_MS = 18000;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sanitize(value) {
  return String(value || '')
    .replace(/(sk|tp|ak|api)[-_][A-Za-z0-9_*.-]{8,}/gi, '$1-***')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email]')
    .replace(/\b1[3-9]\d{9}\b/g, '[phone]')
    .replace(/\b\d{16,}\b/g, '[long-number]');
}

async function capturePlatform(key) {
  const config = PLATFORMS[key];
  const platformSession = session.fromPartition(config.partition);
  const page = new BrowserWindow({
    show: false,
    width: 1360,
    height: 920,
    webPreferences: {
      session: platformSession,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false
    }
  });

  try {
    await page.loadURL(config.urls.usage).catch((error) => error);
    await sleep(WAIT_MS);

    const capture = await page.webContents.executeJavaScript(
      `(() => ({
        url: location.href,
        title: document.title || '',
        text: document.body ? document.body.innerText : '',
        htmlLength: document.documentElement ? document.documentElement.outerHTML.length : 0
      }))()`,
      true
    );

    const lines = sanitize(capture.text)
      .replace(/\u00a0/g, ' ')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      key,
      url: sanitize(capture.url),
      title: sanitize(capture.title),
      htmlLength: capture.htmlLength,
      lineCount: lines.length,
      firstLines: lines.slice(0, 120),
      moneyLines: lines.filter((line) => /¥|￥|CNY|余额|消费|充值/.test(line)).slice(0, 80),
      planLines: lines.filter((line) => /套餐|Token|Credits|有效|使用|用量|到期|余额/.test(line)).slice(0, 100)
    };
  } finally {
    if (!page.isDestroyed()) {
      page.destroy();
    }
  }
}

async function runDiagnostics() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const result = {
    createdAt: new Date().toISOString(),
    userData: app.getPath('userData'),
    targets: []
  };

  for (const key of TARGETS) {
    try {
      result.targets.push(await capturePlatform(key));
    } catch (error) {
      result.targets.push({
        key,
        error: sanitize(error && error.message ? error.message : error)
      });
    }
  }

  const outputPath = path.join(OUTPUT_DIR, 'last-capture.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(outputPath);
  return outputPath;
}

if (require.main === module) {
  app.setName('floating-token-bi');
  app.whenReady().then(async () => {
    await runDiagnostics();
    app.quit();
  });
}

module.exports = {
  runDiagnostics
};
