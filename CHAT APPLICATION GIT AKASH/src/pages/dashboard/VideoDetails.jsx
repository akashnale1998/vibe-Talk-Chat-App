import React from 'react';
import { Grid, Typography, Box, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import MainCard from 'components/MainCard';
import OrdersTable from './OrdersTable';
// import vid from './../../assets/images/users/vid.mp4';
import ReplyIcon from '@mui/icons-material/Reply';

const VideoDetails = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* Back Button */}
        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon sx={{ fontSize: '1.3rem' }} />} // Increased icon font size
            onClick={handleBack}
            sx={{
              borderColor: '#3a186e', // Sets the border color
              padding: '5px 15px',
              borderRadius: '8px', // Rounded corners for modern look
              color: '#3a186e', // Ensures the text color matches the border
              fontSize: '13px', // Adjusts button text size
              transition: 'all 0.3s ease', // Smooth transition for hover/active
              '&:hover': {
                borderColor: '#3a186e', // Keeps the same color on hover
                color: '#3a186e'
              },
              '&:active': {
                transform: 'scale(0.95)' // Slight press effect
              }
            }}
          >
            Back
          </Button>
        </Grid>

        {/* Video Section */}
        {/* <Grid item xs={12}>
          <Box sx={{ width: '100%', position: 'relative' }}>
            <video src={vid} width="100%" height="auto" controls style={{ objectFit: 'cover' }} aria-label="Video content" />
          </Box>
        </Grid> */}

        {/* Video Details */}
        <Grid item xs={12} md={7} lg={8} sx={{ mt: 5 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Video Details</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Orders Table Section */}
      <MainCard sx={{ mt: 2 }} content={false}>
        <OrdersTable />
      </MainCard>
    </>
  );
};

export default VideoDetails;
