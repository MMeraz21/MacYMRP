const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    },
    removeListener: (channel, func) => {
      ipcRenderer.removeListener(channel, func);
    }
  }
});

