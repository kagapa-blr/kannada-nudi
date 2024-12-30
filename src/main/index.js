//src/main/index.js

import { app, BrowserWindow, ipcMain } from 'electron';
import os from 'os';
import { join } from 'path';
import { setupFileOperations } from './lib/fileops.js';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.maximize();
  mainWindow.setTitle('Untitled'); // Default title

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // Listen for title update events
  ipcMain.on('set:title', (_, title) => {
    mainWindow.setTitle(title);  // Set the window title to the provided string
    console.log('Window title set to:', title);  // Log the updated title
  });

  // Add this IPC handler
  ipcMain.handle('get:title', () => {
    if (mainWindow) {
      return mainWindow.getTitle(); // Retrieve the current window title
    }
    return null; // Return null if the window is not available
  });


}

app.whenReady().then(() => {
  createWindow();
  setupFileOperations();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Utility handlers
ipcMain.handle('get:cwd', () => process.cwd());
ipcMain.handle('get:rootDir', () => join(os.homedir(), 'kannada-nudi'));
