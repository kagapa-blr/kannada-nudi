import { dialog, ipcMain } from 'electron';
import fs from 'fs';

export function setupFileOperations() {
  // Handle file open
  ipcMain.handle('file:open', async (event) => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
      });
      if (canceled || !filePaths.length) return null;

      const filePath = filePaths[0];
      const content = fs.readFileSync(filePath, 'utf8');

      // Notify renderer to update the title
      event.sender.send('update:title', filePath);

      return { filePath, content };
    } catch (error) {
      console.error('Error opening file:', error);
      return { error: 'Failed to open file' };
    }
  });

  // Handle "Save As" functionality
  ipcMain.handle('file:saveAs', async (event, content) => {
    try {
      const { canceled, filePath } = await dialog.showSaveDialog();
      if (canceled) return null;

      fs.writeFileSync(filePath, content, 'utf8');
      event.sender.send('update:title', filePath);

      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      return { error: 'Failed to save file' };
    }
  });

  // Handle "Save" functionality
  ipcMain.handle('file:save', async (event, filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      event.sender.send('update:title', filePath);

      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      return { error: 'Failed to save file' };
    }
  });

  // Handle file read
  ipcMain.handle('file:read', async (_, filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      return { error: 'Failed to read file' };
    }
  });

  // Handle appending content to a file
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
