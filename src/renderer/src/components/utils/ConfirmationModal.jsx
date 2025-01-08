import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmationModal = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="rounded-lg shadow-lg"
    >
      <DialogTitle className="text-center text-xl font-semibold text-gray-800">
        Confirm Action
      </DialogTitle>
      <DialogContent>
        <p className="text-gray-700 text-center">{message}</p>
      </DialogContent>
      <DialogActions className="justify-center">
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          className="mr-4 px-6 py-2 text-gray-600 font-medium"
        >
          ಇಲ್ಲ
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          className="px-6 py-2 text-white font-medium"
        >
          ಹೊಸ ಕಡತ ತೆರೆಯಿರಿ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
