// Modules to control application life and create native browser window
const {app, BrowserWindow, shell, ipcMain} = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
require('dotenv').config();
const { Notification } = require('electron');
const Store = require('electron-store');
const app_storage = new Store();
const keytar = require('keytar');
const crypto = require('crypto');

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// Determine the environment
const isDev = require('electron-is-dev');

// Allow remote debugging
//app.commandLine.appendSwitch('remote-debugging-port', '9222');

let mainWindow;

// Register credentials handler only once during app initialization
if (!ipcMain.listeners('get-auth-credentials').length) {
  ipcMain.handle('get-auth-credentials', async (event) => {
    // Get account name from app storage
    const authInfo = app_storage.get('auth-info');

    // Check if account info exists
    if (authInfo) {
      const account_name = authInfo.account;

      // Get credentials from OS password storage
      const credentials_raw = await keytar.getPassword("Ringer", account_name);

      let parsed_credentials;

      // Parse credentials
      if (credentials_raw) {
        try {
          parsed_credentials = JSON.parse(credentials_raw);
        } catch {
          parsed_credentials = null;
        } 
      }
      
      return parsed_credentials;
    } else {
      return null;
    }
  });
}

function createWindow () {
  // Dynamically set the window width
  const window_width = isDev ? 1500 : 1000;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: window_width,
    height: 600,
    minWidth:900,
    minHeight: 600,
    frame: true,
    title: "Ringer",
    contextIsolation: true,
    enableRemoteModule: true,
    icon: path.join(__dirname, 'public/favicon.ico'),
    webPreferences: {
      devTools: isDev, // Dynamically enables/disables the dev tools based on environment
      webSecurity: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Open dev tools based on environment
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  const unhandled = require('electron-unhandled');
  unhandled();

  // Listen for open browser event
  ipcMain.on('open-url', (event, url) => {
    console.log('opening ' + url);
    shell.openExternal(url);
  });

  ipcMain.on('send-notification', (event, title, description) => {
    console.log('sending notification');
    const myNotification = new Notification({ 
        title: title, 
        body: description 
    });
    myNotification.show();
  });

  // Handles saving auth credentials to device
  ipcMain.on('set-auth-credentials', (event, username, token) => {
    // Hash the account name for storage
    const account_hash = crypto.createHash('sha256').update(username).digest('hex');

    // Save account hash to app data
    app_storage.set('auth-info', {
      account: account_hash,
    });

    // Convert credentials to JSON string for storage
    const credentials_string = JSON.stringify({username: username, token: token});

    // Save credentials to device password manager
    keytar.setPassword("Ringer", account_hash, credentials_string);
  });

  // Handles the removal of user credentials from device
  ipcMain.on('remove-auth-credentials', async (event) => {
    // Get account name from app storage
    const accountInfo = app_storage.get('auth-info');
    const account_name = accountInfo.account;

    // Remove credentials from password manager
    await keytar.deletePassword("Ringer", account_name);

    // Remove account name from app storage
    app_storage.delete('auth-info');
  });

  // Remove the menu bar from the main window
  mainWindow.setMenuBarVisibility(false);

  // Load app based on environment
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    
  } else {
    const url = require('url');

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '/build/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Set the icon path based on the environment
  const iconPath = isDev ? '/public/Ringer-Icon-Dev.png' : '/build/Ringer-Icon-Production.png';

  // Sets the icon for the app
  mainWindow.setIcon(path.join(__dirname, iconPath));

}

autoUpdater.on('update-downloaded', (release) => {
  mainWindow.webContents.send('update-downloaded', release);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then( async() => {
  createWindow();

  autoUpdater.checkForUpdates();
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();

  })
})

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.