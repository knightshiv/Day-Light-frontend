import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const UploadPopup = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      setFile(null);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column', // Align items vertically
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Upload File
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            style={{ marginRight: '10px' }}
          />
          <Button onClick={handleUpload} variant="contained" color="primary">
            Upload
          </Button>
        </Box>
      </Box>
    </Modal>
  );
  
};

export default UploadPopup;

