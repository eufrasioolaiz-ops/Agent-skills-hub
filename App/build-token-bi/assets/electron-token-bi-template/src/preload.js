const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tokenBI', {
  readNow: () => ipcRenderer.invoke('token:read-now'),
  refreshNow: () => ipcRenderer.invoke('token:refresh-now'),
  openPlatform: (key) => ipcRenderer.invoke('token:open-platform', key),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('window:toggle-top'),
  onSnapshot: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('token:update', listener);

    return () => ipcRenderer.removeListener('token:update', listener);
  },
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close')
});
