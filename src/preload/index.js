// src/preload/index.js

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: async () => {
    try {
      const result = await ipcRenderer.invoke('file:open')
      if (result && result.error) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error('Error opening file:', error)
      return { error: 'Failed to open file' }
    }
  },

  saveFileAs: async (content) => {
    try {
      const filePath = await ipcRenderer.invoke('file:saveAs', content)
      if (filePath && filePath.error) {
        throw new Error(filePath.error)
      }
      return filePath
    } catch (error) {
      console.error('Error saving file:', error)
      return { error: 'Failed to save file' }
    }
  },

  saveFile: async (filePath, content) => {
    try {
      const result = await ipcRenderer.invoke('file:save', filePath, content)
      if (result && result.error) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error('Error saving file:', error)
      return { error: 'Failed to save file' }
    }
  },

  readFile: async (filePath) => {
    try {
      const content = await ipcRenderer.invoke('file:read', filePath)
      return content
    } catch (error) {
      console.error('Error reading file:', error)
      return { error: 'Failed to read file' }
    }
  },

  appendContent: async (filePath, content) => {
    try {
      const result = await ipcRenderer.invoke('file:append', filePath, content)
      if (result && result.error) {
        throw new Error(result.error)
      }
      return result
    } catch (error) {
      console.error('Error appending content:', error)
      return { error: 'Failed to append content' }
    }
  }
})
