const { contextBridge, ipcRenderer } = require('electron/renderer')

// Expose main process methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  openURL: (url) => ipcRenderer.send('open-url', url),
  restartApp: () => ipcRenderer.send('restart-app'),
  sendNotification: (title, description, conversation_id) => ipcRenderer.send('send-notification', title, description, conversation_id)
})

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, func) => {
      const validChannels = ['update-downloaded', 'open-conversation'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
});