require('dotenv').config();
const { notarize } = require('electron-notarize');
const fs = require('fs');

function logErrorToFile(error) {
    const errorMessage = `${new Date().toISOString()} - Error: ${error.message}\n`;
    fs.writeFile('error.log', errorMessage, { flag: 'a' }, (err) => {
        if (err) {
            console.error('Failed to write error to file:', err);
        } else {
            console.error('Failed to notarize! Error logged to "error.log".');
        }
    });
}

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  console.log('Notarizing macOS build...');
  try {
    await notarize({
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
        teamId: process.env.APPLE_TEAM_ID,
        tool: 'notarytool'
      });

      console.log('Notarization completed.');
  } catch (error) {
    logErrorToFile(error);
  };
};
