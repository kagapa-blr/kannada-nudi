import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Open a file and get its content
  openFile: async () => {
    try {
      const result = await ipcRenderer.invoke('file:open');
      if (result?.error) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error('Error opening file:', error);
      return { error: 'Failed to open file' };
    }
  },

  // Save content as a new file
  saveFileAs: async (content) => {
    try {
      const filePath = await ipcRenderer.invoke('file:saveAs', content);
      if (filePath?.error) throw new Error(filePath.error);
      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      return { error: 'Failed to save file' };
    }
  },

  // Save content to an existing file
  saveFile: async (filePath, content) => {
    try {
      const result = await ipcRenderer.invoke('file:save', filePath, content);
      if (result?.error) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error('Error saving file:', error);
      return { error: 'Failed to save file' };
    }
  },

  // Read a file and get its content
  readFile: async (filePath) => {
    try {
      return await ipcRenderer.invoke('file:read', filePath);
    } catch (error) {
      console.error('Error reading file:', error);
      return { error: 'Failed to read file' };
    }
  },

  // Append content to a file
  appendContent: async (filePath, content) => {
    try {
      const result = await ipcRenderer.invoke('file:append', filePath, content);
      if (result?.error) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error('Error appending content:', error);
      return { error: 'Failed to append content' };
    }
  },

  // Get the current working directory
  getCwd: async () => {
    try {
      return await ipcRenderer.invoke('get:cwd');
    } catch (error) {
      console.error('Error fetching current working directory:', error);
      return { error: 'Failed to fetch current working directory' };
    }
  },

  // Get the root directory
  getRootDir: async () => {
    try {
      return await ipcRenderer.invoke('get:rootDir');
    } catch (error) {
      console.error('Error fetching root directory:', error);
      return { error: 'Failed to fetch root directory' };
    }
  },

  // Set the window title
  setWindowTitle: (title) => {
    ipcRenderer.send('set:title', title);
  },

  // Get the current window title
  getWindowTitle: async () => {
    try {
      return await ipcRenderer.invoke('get:title');
    } catch (error) {
      console.error('Error getting window title:', error);
      return { error: 'Failed to get window title' };
    }
  },

  // Zoom in
  zoomIn: () => ipcRenderer.send('zoom:in'),

  // Zoom out
  zoomOut: () => ipcRenderer.send('zoom:out'),

  // Reset zoom
  resetZoom: () => ipcRenderer.send('zoom:reset'),

  // Show a confirmation dialog
  showConfirmation: (message) => {
    return ipcRenderer.invoke('show-confirmation', message);
  },

  // Search for a word in the window
  searchInWindow: (word) => {
    ipcRenderer.send('search:inWindow', word);
  },

  // Start speech recognition (placeholder)
  startSpeechRecognition: async () => {
    try {
      console.log('startSpeechRecognition API not available!');
      return { success: false, error: 'Speech recognition not implemented' };
    } catch (error) {
      console.error('Error in starting speech recognition:', error);
      return { success: false, error: error.message };
    }
  },
});
