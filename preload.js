const { contextBridge, ipcRenderer } = require('electron/renderer')

// Allow render process to open external links
contextBridge.exposeInMainWorld('electronAPI', {
  openURL: (url) => ipcRenderer.send('open-url', url)
})