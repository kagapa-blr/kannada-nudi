import { dialog, ipcMain } from 'electron';
import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';

export function setupFileOperations() {
  // Handle opening a file
  ipcMain.handle('file:open', async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Documents', extensions: ['txt', 'docx'] } // Allow .txt and .docx files
        ],
      });
      if (canceled || !filePaths.length) return null;

      const filePath = filePaths[0];
      const fileExtension = path.extname(filePath).toLowerCase();
      let content;

      if (fileExtension === '.txt') {
        content = fs.readFileSync(filePath, 'utf8');
      } else if (fileExtension === '.docx') {
        const buffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer });
        content = result.value;
      } else {
        throw new Error('Unsupported file format');
      }

      return { filePath, content };
    } catch (error) {
      console.error('Error opening file:', error);
      return { error: 'Failed to open file' };
    }
  });

  // Handle saving a file as a new file
  ipcMain.handle('file:saveAs', async (_, content) => {
    try {
      const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'Word Documents', extensions: ['docx'] }
        ],
      });
      if (canceled || !filePath) return null;

      const fileExtension = path.extname(filePath).toLowerCase();
      if (fileExtension === '.txt') {
        fs.writeFileSync(filePath, content, 'utf8');
      } else if (fileExtension === '.docx') {
        throw new Error('Saving as .docx not supported yet'); // Optional: Implement .docx save
      } else {
        throw new Error('Unsupported file format');
      }

      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      return { error: 'Failed to save file' };
    }
  });

  // Handle saving content to an existing file
  ipcMain.handle('file:save', async (_, filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      return { error: 'Failed to save content to file' };
    }
  });

  // Handle reading a file
  ipcMain.handle('file:read', async (_, filePath) => {
    try {
      const fileExtension = path.extname(filePath).toLowerCase();
      let content;

      if (fileExtension === '.txt') {
        content = fs.readFileSync(filePath, 'utf8');
      } else if (fileExtension === '.docx') {
        const buffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer });
        content = result.value;
      } else {
        throw new Error('Unsupported file format');
      }

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



  // Handle validating a file path
  ipcMain.handle('file:validatePath', async (_, filePath) => {
    try {
      const exists = fs.existsSync(filePath);
      return exists;
    } catch (error) {
      console.error('Error validating file path:', error);
      return false;
    }
  });
}
