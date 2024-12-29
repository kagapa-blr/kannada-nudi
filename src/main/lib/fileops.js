const { ipcMain } = require('electron');
const os = require('os');
const path = require('path');
const { appDirectoryName } = require('./src/shared/constants');

ipcMain.handle('get-root-dir', () => {
  return path.join(os.homedir(), appDirectoryName);
});
