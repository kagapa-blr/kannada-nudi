import { exec } from 'child_process';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import os from 'os';
import { join } from 'path';
import icon from '../../resources/assets/logo.png?asset';
import { setupFileOperations } from './lib/fileops.js';
import SpeechToText from './lib/speechToText';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true,
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
}

function executeBackgroundProcess() {
  if (process.platform === 'win32') {
    const arch = process.arch; // 'x32' or 'x64'
    if (arch === 'ia32' || arch === 'x64') {

      const exePath = join(__dirname, '../../resources/keyboard/kannadaKeyboard.exe');
      const child = exec(`"${exePath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing .exe: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error output: ${stderr}`);
          return;
        }
        console.log(`Output: ${stdout}`);
      });

      // Optional: Log when the process exits
      child.on('exit', (code) => {
        console.log(`Background process exited with code ${code}`);
      });
    } else {
      console.log('Skipping execution: Unsupported Windows architecture.');
    }
  } else {
    console.log('Background process execution is skipped as the platform is not Windows.');
  }
}

function setupZoomHandlers() {
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


// Set up the voice-to-text API
function setupSpeechToTextAPI() {
  const speechToText = new SpeechToText();
  ipcMain.handle('start:voiceToText', async () => {
    if (!speechToText.isSupported) {
      console.error('Speech-to-Text API is not supported in this environment.');
      return;
    }

    try {
      // const transcript = await speechToText.startListening();
      // return { success: true, transcript };
      console.log('Speech to text will be implemented very soon!')
    } catch (error) {
      console.error('Error during speech-to-text:', error);
      return { success: false, error: error.message };
    }
  });
}


app.whenReady().then(() => {
  createWindow();
  setupFileOperations();
  executeBackgroundProcess();
  setupZoomHandlers();
  setupSpeechToTextAPI(); 

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
