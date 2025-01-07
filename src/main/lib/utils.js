import { ipcMain, dialog, BrowserWindow } from 'electron';
import os from 'os';

// Get the current window title
export function setupWindowTitleHandler(mainWindow) {
  ipcMain.on('set:title', (_, title) => {
    mainWindow.setTitle(title); // Set the window title to the provided string
    console.log('Window title set to:', title); // Log the updated title
  });

  ipcMain.handle('get:title', () => {
    if (mainWindow) {
      return mainWindow.getTitle(); // Retrieve the current window title
    }
    return null; // Return null if the window is not available
  });
}

// Handle the request to get the OS type
export function setupOSTypeHandler() {
  ipcMain.handle('get-os-type', () => {
    return os.platform(); // Returns 'win32', 'darwin', 'linux', etc.
  });
}

// Show a confirmation dialog
export async function setupConfirmationDialogHandler(mainWindow) {
  ipcMain.handle('show-confirmation', async (_, message) => {
    const response = await dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Cancel', 'OK'],
      defaultId: 1,
      cancelId: 0,
      message: message,
    });

    return response.response === 1; // Returns true if OK (1), false if Cancel (0)
  });
}

// Handle zoom operations
export function setupZoomHandlers(mainWindow) {
  ipcMain.on('zoom:in', () => {
    if (mainWindow) {
      const currentZoom = mainWindow.webContents.getZoomFactor();
      mainWindow.webContents.setZoomFactor(currentZoom + 0.1);
    }
  });

  ipcMain.on('zoom:out', () => {
    if (mainWindow) {
      const currentZoom = mainWindow.webContents.getZoomFactor();
      mainWindow.webContents.setZoomFactor(currentZoom - 0.1);
    }
  });

  ipcMain.on('zoom:reset', () => {
    if (mainWindow) mainWindow.webContents.setZoomFactor(1);
  });
}

// Handle search request
export function setupSearchHandler(mainWindow) {
  ipcMain.on('search:inWindow', (_, word) => {
    if (mainWindow) {
      mainWindow.webContents.findInPage(word); // Trigger search in the webContents of the window
    }
  });
}

// Get current working directory
export function setupCwdHandler() {
  ipcMain.handle('get:cwd', () => process.cwd());
}

// Get the root directory
export function setupRootDirHandler() {
  ipcMain.handle('get:rootDir', () => join(os.homedir(), 'kannada-nudi'));
}
