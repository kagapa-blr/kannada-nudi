import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { downloadAsDocx, downloadAsPdf, downloadAsTxt } from '../../services/download.js' // Import the helper functions

const FileSave = ({ open, handleClose, htmlContent }) => {
  const [fileType, setFileType] = useState('txt')
  const [error, setError] = useState('') // State to hold error message

  // Helper function to check if content is visually empty
  const isContentEmpty = (content) => {
    const emptyHtmlRegex = /^(<p><br><\/p>|<br\s*\/?>|<p>\s*<\/p>|\s*)$/i
    return !content || emptyHtmlRegex.test(content.trim())
  }

  const handleSave = () => {
    if (isContentEmpty(htmlContent)) {
      setError('Cannot save an empty file.') // Set error message
      return
    }

    setError('') // Clear error message if content is valid

    switch (fileType) {
      case 'txt':
        downloadAsTxt(htmlContent) // Save as txt
        break
      case 'docx':
        downloadAsDocx(htmlContent) // Save as docx
        break
      case 'pdf':
        downloadAsPdf(htmlContent) // Save as pdf
        break
      default:
        break
    }
    handleClose() // Close the modal after saving
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="shadow-lg">
        <Typography variant="h6" className="font-bold text-center mb-4">
          Save File
        </Typography>
        <FormControl className="w-full">
          <Typography variant="body1" className="mb-2 font-medium">
            Choose File Format:
          </Typography>
          <RadioGroup
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="flex flex-col space-y-2"
          >
            <FormControlLabel value="txt" control={<Radio />} label="TXT" />
            <FormControlLabel value="docx" control={<Radio />} label="DOCX" />
            <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
          </RadioGroup>
        </FormControl>
        {error && ( // Display error message if present
          <Typography variant="body2" color="error" className="mt-4">
            {error}
          </Typography>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <Button onClick={handleClose} variant="outlined" className="text-gray-600">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default FileSave
