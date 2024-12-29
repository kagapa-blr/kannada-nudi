// src/main/index.js

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import fs from 'fs'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Handle file operations

ipcMain.handle('file:open', async () => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile']
    })
    if (canceled || !filePaths.length) return null

    const filePath = filePaths[0]
    const content = fs.readFileSync(filePath, 'utf8')
    return { filePath, content }
  } catch (error) {
    console.error('Error opening file:', error)
    return { error: 'Failed to open file' }
  }
})

ipcMain.handle('file:saveAs', async (_, content) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog()
    if (canceled) return null

    fs.writeFileSync(filePath, content, 'utf8')
    return filePath
  } catch (error) {
    console.error('Error saving file:', error)
    return { error: 'Failed to save file' }
  }
})

ipcMain.handle('file:save', async (_, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8')
    return filePath
  } catch (error) {
    console.error('Error saving file:', error)
    return { error: 'Failed to save content to file' }
  }
})

ipcMain.handle('file:read', async (_, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return content
  } catch (error) {
    console.error('Error reading file:', error)
    return { error: 'Failed to read file' }
  }
})

ipcMain.handle('file:append', async (_, filePath, content) => {
  try {
    fs.appendFileSync(filePath, content, 'utf8')
    return { success: true }
  } catch (error) {
    console.error('Error appending content to file:', error)
    return { error: 'Failed to append content' }
  }
})
