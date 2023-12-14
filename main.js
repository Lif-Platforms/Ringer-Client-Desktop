// Modules to control application life and create native browser window
const {app, BrowserWindow, session, protocol} = require('electron');
const path = require('path');
require('dotenv').config();
const Store = require('electron-store');

// Create new local storage for browser cookies
// Will be loaded into storage before app quit
const store = new Store();

// Determine the environment
const isDev = require('electron-is-dev');

// Allow remote debugging
//app.commandLine.appendSwitch('remote-debugging-port', '9222');

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
      devTools: true, // Dynamically enables/disables the dev tools based on environment
      webSecurity: false
    }
  })

  mainWindow.webContents.openDevTools();

  const unhandled = require('electron-unhandled');
  unhandled();

  //removes the menu bar from the main window
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then( async() => {
  createWindow()

  // Grab cookies from electron storage and save them as browser cookies
  // This is so they can be easily accessed from the render process
  const credentials = store.get('credentials');

  if (credentials) {
    try {
      const { username, token } = credentials;

      // Specify the URL for your app (change this to your actual app URL)
      const appUrl = 'http://localhost:3000';

      // Set cookies in the session with the 'url' option
      await session.defaultSession.cookies.set({
        url: appUrl,
        name: 'Token',
        value: token,
      });

      await session.defaultSession.cookies.set({
        url: appUrl,
        name: 'Username',
        value: username,
      });

      console.log('Set cookies for Token and Username');
    } catch (error) {
      console.error('Error setting cookies:', error);
    }
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

// Before app quits, save all browser cookies (Username and Token) for next session use
// They will be loaded up on app start
app.on('before-quit', async () => {
  console.log('Saving Cookies...');

  const tokenCookies = await session.defaultSession.cookies.get({ name: 'Token' });
  const usernameCookies = await session.defaultSession.cookies.get({ name: 'Username' });

  if (tokenCookies.length > 0 && usernameCookies.length > 0) {
    const tokenValue = tokenCookies[0].value;
    const usernameValue = usernameCookies[0].value;

    console.log('Auth Info:', tokenValue, usernameValue);

    // Store credentials securely using electron-store
    store.set('credentials', {
      username: usernameValue,
      token: tokenValue,
    });

    console.log('Saved Credentials!');
  } else {
    store.delete('credentials');
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.