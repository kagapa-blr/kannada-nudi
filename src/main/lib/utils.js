import { dialog, ipcMain } from 'electron';

// Listen for title update events
ipcMain.on('set:title', (_, title) => {
    mainWindow.setTitle(title); // Set the window title to the provided string
    console.log('Window title set to:', title); // Log the updated title
});

// Add this IPC handler
ipcMain.handle('get:title', () => {
    if (mainWindow) {
        return mainWindow.getTitle(); // Retrieve the current window title
    }
    return null; // Return null if the window is not available
});

// Add the confirmation dialog IPC handler
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

// Handle search request
ipcMain.on('search:inWindow', (_, word) => {
    if (mainWindow) {
        mainWindow.webContents.findInPage(word); // Trigger search in the webContents of the window
    }
});

// Handle the request to get the OS type
ipcMain.handle('get-os-type', () => {
    return os.platform(); // Returns 'win32', 'darwin', 'linux', etc.
});
