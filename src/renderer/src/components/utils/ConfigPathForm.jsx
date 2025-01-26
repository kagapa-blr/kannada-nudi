import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const ConfigPathForm = ({ open, onClose }) => {
  const [dictionaryPath, setDictionaryPath] = useState('')
  const [sysmspellPath, setSysmspellPath] = useState('')
  const [datasetPath, setDatasetPath] = useState('')
  const [dictionaryError, setDictionaryError] = useState('')
  const [sysmspellError, setSysmspellError] = useState('')
  const [datasetError, setDatasetError] = useState('')

  const handleSave = async (e) => {
    e.preventDefault()

    // Reset previous errors
    setDictionaryError('')
    setSysmspellError('')
    setDatasetError('')

    // Validate paths before saving
    const dictionaryValid = await window.electronAPI.validatePath(dictionaryPath)
    const sysmspellValid = await window.electronAPI.validatePath(sysmspellPath)
    const datasetValid = await window.electronAPI.validatePath(datasetPath)

    // Set errors if any validation fails
    if (!dictionaryValid) {
      setDictionaryError('Invalid dictionary config path.')
    }
    if (!sysmspellValid) {
      setSysmspellError('Invalid sysmspell config path.')
    }
    if (!datasetValid) {
      setDatasetError('Invalid dataset path.')
    }

    if (!dictionaryValid || !sysmspellValid || !datasetValid) {
      return // Do not proceed if there are any validation errors
    }

    // Proceed with the save logic if all paths are valid
    console.log('Dictionary Config Path:', dictionaryPath)
    console.log('Sysmspell Config Path:', sysmspellPath)
    console.log('Dataset Path:', datasetPath)
    onClose() // Close modal after save
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-center bg-blue-700 text-white py-4 text-2xl font-bold tracking-wide">
        Configuration Paths
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSave} className="space-y-6 mt-6">
          <TextField
            fullWidth
            label="Dictionary Config Path"
            variant="outlined"
            value={dictionaryPath}
            onChange={(e) => setDictionaryPath(e.target.value)}
            required
            className="shadow-md rounded-md focus:ring-2 focus:ring-blue-500"
            error={!!dictionaryError}
            helperText={dictionaryError}
            sx={{
              '& .MuiInputBase-root': {
                paddingRight: '12px', // added right padding for cleaner text entry
              },
            }}
          />
          <TextField
            fullWidth
            label="Sysmspell Config Path"
            variant="outlined"
            value={sysmspellPath}
            onChange={(e) => setSysmspellPath(e.target.value)}
            required
            className="shadow-md rounded-md focus:ring-2 focus:ring-blue-500"
            error={!!sysmspellError}
            helperText={sysmspellError}
            sx={{
              '& .MuiInputBase-root': {
                paddingRight: '12px', // added right padding for cleaner text entry
              },
            }}
          />
          <TextField
            fullWidth
            label="Dataset Path"
            variant="outlined"
            value={datasetPath}
            onChange={(e) => setDatasetPath(e.target.value)}
            required
            className="shadow-md rounded-md focus:ring-2 focus:ring-blue-500"
            error={!!datasetError}
            helperText={datasetError}
            sx={{
              '& .MuiInputBase-root': {
                paddingRight: '12px', // added right padding for cleaner text entry
              },
            }}
          />
          <div className="flex justify-end space-x-6 mt-8">
            <Button
              onClick={onClose}
              color="secondary"
              className="text-sm text-gray-600 hover:bg-gray-200 py-3 px-5 rounded-lg transition duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="text-sm bg-blue-700 hover:bg-blue-800 py-3 px-8 rounded-lg transition duration-200"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ConfigPathForm
