const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');
const { createSystemSampler } = require('./metrics');

const WINDOW_WIDTH = 860;
const WINDOW_HEIGHT = 196;

let mainWindow;
let sampler;
let pollTimer;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: Math.max(24, width - WINDOW_WIDTH - 36),
    y: Math.max(24, height - WINDOW_HEIGHT - 48),
    minWidth: 720,
    minHeight: 150,
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function publishMetrics() {
  if (!mainWindow || mainWindow.isDestroyed() || !sampler) {
    return;
  }

  const metrics = await sampler.sample();
  mainWindow.webContents.send('metrics:update', metrics);
}

app.whenReady().then(() => {
  sampler = createSystemSampler();
  createWindow();

  pollTimer = setInterval(publishMetrics, 1000);
  publishMetrics();

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

ipcMain.handle('metrics:read-now', async () => {
  if (!sampler) {
    sampler = createSystemSampler();
  }

  return sampler.sample();
});
