// Modules to control application life and create native browser window
const {app, BrowserWindow, shell, ipcMain} = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
require('dotenv').config();
const { Notification } = require('electron');
const sound = require("sound-play");

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// Determine the environment
const isDev = require('electron-is-dev');

// Allow remote debugging
//app.commandLine.appendSwitch('remote-debugging-port', '9222');

let mainWindow;

async function createWindow () {
  const { default: Store } = await import('electron-store'); // Dynamically import electron-store
  const store = new Store();

  // Get window information
  const windowState = store.get('windowState', { 
    width: 1000,
    height: 600,
    isMaximized: false
  });

  // Store the current window size
  let windowSize = { width: windowState.width, height: windowState.height };

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
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
  });

  // If window should be maximized, maximize it.
  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

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
  })

  ipcMain.on('send-notification', (event, title, description, conversation_id) => {
    // Create a new notification
    const notification = new Notification({ 
      title: title,
      subtitle: 'Ringer',
      body: description, 
      icon: path.join(__dirname, 'public/favicon.ico'),
      silent: true,
      onClick: () => {
        console.log('Notification clicked');
      }
    });

    // If a conversation ID is provided, add a click event to open the conversation
    if (conversation_id) {
      notification.on('click', () => {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('open-conversation', { conversation_id });
        notification.close();
      });
    }

    // Show the notification
    notification.show();

    // Play sound when notification is shown
    sound.play(path.join(__dirname, 'public/sounds/notification_1.mp3'));
  })

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

  mainWindow.on('resized', () => {
    // Get the size of the window
    const bounds = mainWindow.getBounds();
    const windowWidth = bounds.width;
    const windowHeight = bounds.height;

    // Save window size in storage
    store.set('windowState', {
      width: windowWidth,
      height: windowHeight,
      isMaximized: mainWindow.isMaximized()
    });

    // Update window size var
    windowSize.width = windowWidth;
    windowSize.height = windowHeight;
  });

  mainWindow.on('maximize', () => {
    // Store window state in storage
    store.set('windowState', {
      width: windowSize.width,
      height: windowSize.height,
      isMaximized: mainWindow.isMaximized()
    });
  });

  mainWindow.on('unmaximize', () => {
    // Store window state in storage
    store.set('windowState', {
      width: windowSize.width,
      height: windowSize.height,
      isMaximized: mainWindow.isMaximized()
    });
  });
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

  // Set the app name for windows
  if (process.platform === 'win32') {
    app.setAppUserModelId(app.name);
  }
  
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