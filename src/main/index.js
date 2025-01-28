import icon from '@/assets/logo.png';
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { exec } from 'child_process'; // Import exec to run background processes
import { setupFileOperations, createDirectoryAndFiles } from './lib/fileops.js';
import SpeechToText from './lib/speechToText';
import {
  setupConfirmationDialogHandler,
  setupCwdHandler,
  setupOSTypeHandler,
  setupRootDirHandler,
  setupSearchHandler,
  setupWindowTitleHandler,
  setupZoomHandlers
} from './lib/utils.js';

// Declare the main window
let mainWindow;
let backgroundProcess = null; // To store the reference to the background process

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    ...(process.platform === 'linux' || process.platform === 'darwin' ? { icon } : {}),
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

  // Set up window title and other handlers
  setupWindowTitleHandler(mainWindow);
  setupOSTypeHandler();
  setupZoomHandlers(mainWindow);
  setupSearchHandler(mainWindow);
  setupConfirmationDialogHandler(mainWindow);
  setupCwdHandler();
  setupRootDirHandler();
  createDirectoryAndFiles();
}

// Execute the background process (for Windows only)
function executeBackgroundProcess() {
  if (process.platform === 'win32') {
    const arch = process.arch; // 'ia32' or 'x64'
    if (arch === 'ia32' || arch === 'x64') {
      // Determine the path based on the environment
      const env = process.env.NODE_ENV || 'production'; // Default to 'production'
      const exePath = env === 'development'
        ? join(__dirname, '../../resources/keyboard/kannadaKeyboard.exe')
        : join(__dirname, './resources/keyboard/kannadaKeyboard.exe');

      console.log(`NODE_ENV: ${env}`);
      console.log(`Platform: ${process.platform}, Architecture: ${arch}`);
      console.log(`Executable Path: ${exePath}`);

      backgroundProcess = exec(`"${exePath}"`, (error, stdout, stderr) => {
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
      backgroundProcess.on('exit', (code) => {
        console.log(`Background process exited with code ${code}`);
      });
    } else {
      console.log('Skipping execution: Unsupported Windows architecture.');
    }
  } else {
    console.log('Background process execution skipped for non-Windows platforms.');
  }
}

// Terminate the background process when all windows are closed
app.on('window-all-closed', () => {
  if (backgroundProcess) {
    console.log('Terminating background process...');
    try {
      backgroundProcess.kill('SIGTERM'); // Graceful termination
      console.log('Background process terminated gracefully.');
    } catch (error) {
      console.error(`Failed to terminate background process: ${error.message}`);
    }
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Set up the voice-to-text API (Speech-to-Text)
function setupSpeechToTextAPI() {
  const speechToText = new SpeechToText();
  ipcMain.handle('start:voiceToText', async () => {
    if (!speechToText.isSupported) {
      console.error('Speech-to-Text API is not supported in this environment.');
      return { success: false, error: 'Speech-to-Text is not supported.' };
    }

    try {
      const transcript = await speechToText.startListening();
      return { success: true, transcript };
    } catch (error) {
      console.error('Error during speech-to-text:', error);
      return { success: false, error: error.message };
    }
  });
}

// Add global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Initialize the app
app.whenReady().then(() => {
  createWindow();
  setupFileOperations();
  executeBackgroundProcess();
  setupSpeechToTextAPI();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    if (!backgroundProcess) {
      console.log('Reinitializing background process...');
      executeBackgroundProcess();
    }
  });
});
