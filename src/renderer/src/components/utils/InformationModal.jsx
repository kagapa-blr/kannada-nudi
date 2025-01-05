import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React from 'react'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Adjust width for responsiveness
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px'
}

const InformationModal = ({ open, onClose, title = 'Information', message }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="info-modal-title"
      aria-describedby="info-modal-description"
    >
      <Box sx={modalStyle} className="shadow-lg">
        <Typography id="info-modal-title" variant="h6" className="text-center font-bold mb-4">
          {title}
        </Typography>
        <Typography id="info-modal-description" className="text-gray-700 text-center mb-6">
          {message}
        </Typography>
        <div className="flex justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
            className="capitalize px-6 py-2"
          >
            ಸರಿ
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default InformationModal
