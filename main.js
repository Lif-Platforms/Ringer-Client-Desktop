// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
require('dotenv').config();

// Determine the environment
const isDev = process.env.NODE_ENV === 'development';

function createWindow () {
  // Dynamically set the window width
  const window_width = isDev ? 1500 : 1000;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: window_width,
    height: 600,
    minWidth:900,
    minHeight: 600,
    frame: true,
    title: "Ringer",
    contextIsolation: false,
    enableRemoteModule: true,
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev // Dynamically enables/disables the dev tools based on environment
    }
  })

  //removes the menu bar from the main window
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000')

  // Set the icon path based on the environment
  const iconPath = isDev ? '/public/Ringer-Icon-Dev.png' : '/public/Ringer-Icon-Production.png';

  // Sets the icon for the app
  mainWindow.setIcon(path.join(__dirname, iconPath));

  // Open the DevTools.
  if (isDev === true){
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.