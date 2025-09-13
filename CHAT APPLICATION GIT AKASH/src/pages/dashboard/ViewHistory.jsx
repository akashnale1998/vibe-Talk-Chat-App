import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import car7 from '../../assets/images/users/car7.jpg'; // Ensure the path is correct

const ViewHistory = () => {
  return (
    <Box sx={{ p: 0 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ mb: 3, fontSize: '1.1rem' }}>
        Vehicle Details
      </Typography>

      {/* Vehicle Info Container */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* Left Column for Vehicle Image */}
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'start' }}>
            <img src={car7} alt="Vehicle" style={{ width: '100%', maxWidth: 500, borderRadius: '8px', objectFit: 'cover' }} />
          </Grid>

          {/* Right Column for Vehicle Information */}
          <Grid item xs={12} sm={6} my={2}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginLeft: 2, fontSize: '1.1rem' }}>
              Vehicle ID : <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>MH12AB1234</span>
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1.5, marginLeft: 2, fontSize: '1.1rem' }}>
              Vehicle Number :<strong style={{ fontSize: '0.9rem', fontWeight: 500 }}> DL5CN5678</strong>
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1.5, marginLeft: 2, fontSize: '1.1rem' }}>
              Vehicle Speed : <strong style={{ fontSize: '0.9rem', fontWeight: 500 }}> 80 km/h</strong>
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1.5, marginLeft: 2, fontSize: '1.1rem' }}>
              Vehicle Status : <strong style={{ fontSize: '0.9rem', fontWeight: 500 }}>Vehicle Out</strong>
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1.5, marginLeft: 2, fontSize: '1.1rem' }}>
              Date  : <strong style={{ fontSize: '0.9rem', fontWeight: 500 }}>04-01-2025</strong>
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1.5, marginLeft: 2, fontSize: '1.1rem' }}>
              Time  : <strong style={{ fontSize: '0.9rem', fontWeight: 500 }}>03:50 PM</strong>
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Back Button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ bgcolor: '#3a186e', ':hover': { bgcolor: '#3a186e' } }}
          onClick={() => window.history.back()}
        >
          Back to List
        </Button>
      </Box>
    </Box>
  );
};

export default ViewHistory;
