// ConfigPathForm.jsx
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useState } from 'react'

const ConfigPathForm = ({ open, onClose }) => {
  const [dictionaryPath, setDictionaryPath] = useState('')
  const [sysmspellPath, setSysmspellPath] = useState('')
  const [datasetPath, setDatasetPath] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate paths before submitting
    const dictionaryValid = await window.electronAPI.validatePath(dictionaryPath)
    const sysmspellValid = await window.electronAPI.validatePath(sysmspellPath)
    const datasetValid = await window.electronAPI.validatePath(datasetPath)

    if (!dictionaryValid || !sysmspellValid || !datasetValid) {
      console.log('One or more paths are invalid. Please check the input.')
      return
    }

    // Proceed with the submit logic if all paths are valid
    console.log('Dictionary Config Path:', dictionaryPath)
    console.log('Sysmspell Config Path:', sysmspellPath)
    console.log('Dataset Path:', datasetPath)
    onClose() // Close modal after submit
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-center bg-blue-500 text-white">Configuration Paths</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <TextField
            fullWidth
            label="Dictionary Config Path"
            variant="outlined"
            value={dictionaryPath}
            onChange={(e) => setDictionaryPath(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Sysmspell Config Path"
            variant="outlined"
            value={sysmspellPath}
            onChange={(e) => setSysmspellPath(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Dataset Path"
            variant="outlined"
            value={datasetPath}
            onChange={(e) => setDatasetPath(e.target.value)}
            required
          />
          <div className="flex justify-end mt-4">
            <Button onClick={onClose} color="secondary" className="mr-2">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ConfigPathForm
