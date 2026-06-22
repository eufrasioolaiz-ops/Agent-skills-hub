const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('performanceBI', {
  readNow: () => ipcRenderer.invoke('metrics:read-now'),
  onMetrics: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('metrics:update', listener);

    return () => ipcRenderer.removeListener('metrics:update', listener);
  },
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close')
});
