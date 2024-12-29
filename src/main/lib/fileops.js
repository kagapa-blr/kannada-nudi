// src/main/file-operations.js
import { dialog, ipcMain } from 'electron';
import fs from 'fs';

export function setupFileOperations() {
  ipcMain.handle('file:open', async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile']
      });
      if (canceled || !filePaths.length) return null;

      const filePath = filePaths[0];
      const content = fs.readFileSync(filePath, 'utf8');
      return { filePath, content };
    } catch (error) {
      console.error('Error opening file:', error);
      return { error: 'Failed to open file' };
    }
  });

  ipcMain.handle('file:saveAs', async (_, content) => {
    try {
      const { canceled, filePath } = await dialog.showSaveDialog();
      if (canceled || !filePath) return null;

      // Write content to the file
      fs.writeFileSync(filePath, content, 'utf8');

      // Return the file path directly
      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      return { error: 'Failed to save file' };
    }
  });


  // Handle save file
  ipcMain.handle('file:save', async (_, filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      return { error: 'Failed to save content to file' };
    }
  });

  // Handle read file
  ipcMain.handle('file:read', async (_, filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      return { error: 'Failed to read file' };
    }
  });

  // Handle append to file
  ipcMain.handle('file:append', async (_, filePath, content) => {
    try {
      fs.appendFileSync(filePath, content, 'utf8');
      return { success: true };
    } catch (error) {
      console.error('Error appending content to file:', error);
      return { error: 'Failed to append content' };
    }
  });
}
