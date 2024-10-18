const { contextBridge, ipcRenderer } = require('electron/renderer')

// Allow render process to open external links
contextBridge.exposeInMainWorld('electronAPI', {
  openURL: (url) => ipcRenderer.send('open-url', url),
  restartApp: () => ipcRenderer.send('restart-app'),
  sendNotification: (title, description) => ipcRenderer.send('send-notification', title, description)
})

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, func) => {
      const validChannels = ['update-downloaded'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
});