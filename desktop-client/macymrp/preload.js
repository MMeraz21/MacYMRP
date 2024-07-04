const { contextBridge, ipcRenderer } = require('electron');
//const remote = require('@electron/remote');



contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    },
    removeListener: (channel, func) => {
      ipcRenderer.removeListener(channel, func);
    },
  },
  // remote: {
  //   getCurrentWindow: () => remote.getCurrentWindow(),
  // },
});


