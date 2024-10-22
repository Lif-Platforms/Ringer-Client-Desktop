const { contextBridge, ipcRenderer } = require('electron/renderer')

// Allow render process to hook into APIs from the main process
contextBridge.exposeInMainWorld('electronAPI', {
  openURL: (url) => ipcRenderer.send('open-url', url),
  restartApp: () => ipcRenderer.send('restart-app'),
  sendNotification: (title, description) => ipcRenderer.send('send-notification', title, description),
  setAuthCredentials: (username, token) => ipcRenderer.send('set-auth-credentials', username, token),
  getAuthCredentials: () => ipcRenderer.invoke('get-auth-credentials'),
  removeAuthCredentials: () => ipcRenderer.send('remove-auth-credentials')
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