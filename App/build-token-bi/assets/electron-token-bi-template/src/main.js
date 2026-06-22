const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { createTokenMonitor } = require('./token-monitor');

const WINDOW_WIDTH = 940;
const WINDOW_HEIGHT = 252;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const IS_HEADLESS =
  process.env.TOKENBI_DIAGNOSE === '1' ||
  process.argv.some((arg) => arg.includes('diagnose') || arg.includes('snapshot'));

let mainWindow;
let monitor;
let pollTimer;
let nextRefreshAt = null;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: Math.max(24, width - WINDOW_WIDTH - 36),
    y: Math.max(24, height - WINDOW_HEIGHT - 48),
    minWidth: WINDOW_WIDTH,
    minHeight: WINDOW_HEIGHT,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.once('did-finish-load', () => {
    sendSnapshot();
    refreshData('startup');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function snapshotForRenderer() {
  return {
    ...monitor.getSnapshot(),
    nextRefreshAt: nextRefreshAt ? nextRefreshAt.toISOString() : null,
    refreshIntervalMs: REFRESH_INTERVAL_MS
  };
}

function sendSnapshot() {
  if (!mainWindow || mainWindow.isDestroyed() || !monitor) {
    return;
  }

  mainWindow.webContents.send('token:update', snapshotForRenderer());
}

async function refreshData() {
  if (!monitor) {
    return snapshotForRenderer();
  }

  const pendingRefresh = monitor.refreshAll();
  sendSnapshot();
  const snapshot = await pendingRefresh;
  nextRefreshAt = new Date(Date.now() + REFRESH_INTERVAL_MS);
  sendSnapshot();
  return {
    ...snapshot,
    nextRefreshAt: nextRefreshAt.toISOString(),
    refreshIntervalMs: REFRESH_INTERVAL_MS
  };
}

app.whenReady().then(() => {
  if (process.env.TOKENBI_DIAGNOSE === '1' || process.argv.some((arg) => arg.includes('diagnose'))) {
    const { runDiagnostics } = require('../scripts/diagnose-capture');
    runDiagnostics()
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      })
      .finally(() => app.quit());
    return;
  }

  if (process.argv.some((arg) => arg.includes('snapshot'))) {
    const outputDir = path.join(__dirname, '..', 'diagnostics');
    fs.mkdirSync(outputDir, { recursive: true });
    monitor = createTokenMonitor();
    monitor
      .refreshAll()
      .then((snapshot) => {
        const outputPath = path.join(outputDir, 'last-snapshot.json');
        fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), 'utf8');
        console.log(outputPath);
      })
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      })
      .finally(() => app.quit());
    return;
  }

  monitor = createTokenMonitor();
  createWindow();

  pollTimer = setInterval(() => {
    refreshData('interval');
  }, REFRESH_INTERVAL_MS);
  nextRefreshAt = new Date(Date.now() + REFRESH_INTERVAL_MS);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', () => {
  if (pollTimer) {
    clearInterval(pollTimer);
  }
});

app.on('window-all-closed', () => {
  if (IS_HEADLESS) {
    return;
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('window:minimize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window:close', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
});

ipcMain.handle('window:toggle-top', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return false;
  }

  const nextValue = !mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(nextValue);
  return nextValue;
});

ipcMain.handle('token:read-now', () => snapshotForRenderer());

ipcMain.handle('token:refresh-now', () => refreshData('manual'));

ipcMain.handle('token:open-platform', (_event, key) => {
  monitor.openPlatform(key);
});
