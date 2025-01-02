//src/preload/index.js

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
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

  readFile: async (filePath) => {
    try {
      return await ipcRenderer.invoke('file:read', filePath);
    } catch (error) {
      console.error('Error reading file:', error);
      return { error: 'Failed to read file' };
    }
  },

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

  getCwd: async () => {
    try {
      return await ipcRenderer.invoke('get:cwd');
    } catch (error) {
      console.error('Error fetching current working directory:', error);
      return { error: 'Failed to fetch current working directory' };
    }
  },

  getRootDir: async () => {
    try {
      return await ipcRenderer.invoke('get:rootDir');
    } catch (error) {
      console.error('Error fetching root directory:', error);
      return { error: 'Failed to fetch root directory' };
    }
  },


  // Correctly expose the setWindowTitle function
  setWindowTitle: (title) => {
    ipcRenderer.send('set:title', title);
  },

  getWindowTitle: async () => {
    try {
      return await ipcRenderer.invoke('get:title');
    } catch (error) {
      console.error('Error getting window title:', error);
      return { error: 'Failed to get window title' };
    }
  },
  zoomIn: () => ipcRenderer.send('zoom:in'),
  zoomOut: () => ipcRenderer.send('zoom:out'),
  resetZoom: () => ipcRenderer.send('zoom:reset'),

  // Expose the confirmation dialog function
  showConfirmation: (message) => {
    return ipcRenderer.invoke('show-confirmation', message);
  },
  searchInWindow: (word) => {
    ipcRenderer.send('search:inWindow', word);
  },

});
