import React, { useState } from 'react';
import { Box, Button, Typography, LinearProgress, IconButton, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Excelcon from '../../assets/images/users/Excelcon.png';

const FileUploadUI = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Check if the file is an Excel file
    const validFormats = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (selectedFile && validFormats.includes(selectedFile.type)) {
      setFile(selectedFile);
      setUploadProgress(0); // Reset progress
    } else {
      alert('Please upload a valid Excel file (.xls or .xlsx).');
      event.target.value = null; // Reset the file input
    }
  };

  const handleUpload = () => {
    if (!file) return;

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const nextProgress = prev + 10;
        if (nextProgress >= 100) clearInterval(interval);
        return nextProgress;
      });
    }, 300);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: 4,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Typography variant="h5" align="start" sx={{ mb: 2, fontWeight: 600 }}>
        Upload Excel File
      </Typography>

      <Box
        sx={{
          border: '2px dashed #3a186e',
          borderRadius: 2,
          padding: 4,
          textAlign: 'center',
          mb: 3
        }}
      >
        <CloudUploadIcon
          fontSize="large"
          sx={{
            color: 'rgb(58 24 110)',
            height: '3rem',
            width: '5rem'
          }}
        />
        <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: 14 }}>
          Drag & Drop or{' '}
          <Button
            variant="text"
            component="label"
            sx={{
              color: '#3a186e',
              fontWeight: '500',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#e9e3f3',
                fontWeight: '600'
              }
            }}
          >
            Choose file
            <input
              type="file"
              accept=".xls, .xlsx" // Restricts file selection to Excel formats
              hidden
              onChange={handleFileChange}
            />
          </Button>{' '}
          to upload
        </Typography>
        <Typography sx={{ mt: 1, fontSize: 12, color: 'text.secondary' }}>
          Ensure that your file follows the required format. Only Excel files with .xls or .xlsx extensions are supported.
        </Typography>
      </Box>

      {file && (
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Excel Icon */}
            <Box
              component="img"
              src={Excelcon}
              alt="Excel Icon"
              sx={{
                width: '24px',
                height: '24px'
              }}
            />

            {/* File Details */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '16px' }}>
                {file.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleRemoveFile}
            sx={{
              color: '#3a186e',
              backgroundColor: '#e9e3f3',
              '&:hover': {
                backgroundColor: '#e9e3f3'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleUpload}
        disabled={!file || uploadProgress === 100}
        sx={{
          backgroundColor: '#3a186e',
          '&:hover': { backgroundColor: '#3a186e' }
        }}
      >
        Upload File
      </Button>
    </Box>
  );
};

export default FileUploadUI;
