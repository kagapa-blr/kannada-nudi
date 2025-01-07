import icon from '@/assets/logo.png';
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { setupFileOperations } from './lib/fileops.js';
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

// Create the window
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

  // Set up window title and other handlers
  setupWindowTitleHandler(mainWindow);
  setupOSTypeHandler();
  setupZoomHandlers(mainWindow);
  setupSearchHandler(mainWindow);
  setupConfirmationDialogHandler(mainWindow);
  setupCwdHandler();
  setupRootDirHandler();
}

// Execute background process for Windows
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

// Set up the voice-to-text API (Speech-to-Text)
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

// Initialize the app
app.whenReady().then(() => {
  createWindow();
  setupFileOperations();
  executeBackgroundProcess();
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
