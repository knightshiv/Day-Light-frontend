// import React from 'react';
import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@mui/material';

const EditRowModal = ({ open, handleClose, data, handleEditRow }) => {
  // Add necessary state for the edited row details

  
  const handleSave = () => {
    // Perform logic to save edited row details
    handleEditRow(/* pass updated row details */);
    handleClose();
  };
  useEffect(() => {
    // Update the document title using the browser API
  });

  return (
    <Modal open={open} onClose={handleClose}>
      {/* Modal content for editing row */}
      <div>
        {data}
        {/* Input fields to edit row details */}
        {/* Save and Cancel buttons */}
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

export default EditRowModal;
