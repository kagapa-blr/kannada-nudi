import { app, BrowserWindow, ipcMain } from 'electron';
import os from 'os';
import { join } from 'path';
import { setupFileOperations } from './lib/fileops.js';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Maximize the window to full screen but still have window controls
  mainWindow.maximize(); // This will maximize the window
  // Alternatively, if you want a true fullscreen window, use:
  // mainWindow.setFullScreen(true); // This will make it a full-screen window

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // You can also listen for resizing and other window-related events if needed
}

app.whenReady().then(() => {
  createWindow();
  setupFileOperations(); // Setup the file operations IPC handlers

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// New handlers
ipcMain.handle('get:cwd', () => {
  return process.cwd(); // Current working directory
});

ipcMain.handle('get:rootDir', () => {
  const appDirectoryName = 'kannada-nudi'; // Replace with your app's directory name
  return join(os.homedir(), appDirectoryName); // Root directory
});
