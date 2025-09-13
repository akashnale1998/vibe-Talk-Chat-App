import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OrdersTable from './OrdersTable';
import MainCard from 'components/MainCard';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router';
// import vid from './../../assets/images/users/vid.mp4';
import axios from 'axios';

const ANPR = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Handle card click and navigate to the specific video page
  const handleCardClick = (id, index) => {
    if (index === 1) { // If second card (index 1)
      setOpenModal(true); // Open the modal
    } else {
      navigate(`/videoDetails/${id}`); // Navigate to the video details page for other cards
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  const cards = [
    { id: 1, title: 'Video 1', description: 'Details about Video 1', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 2, title: 'Video 2', description: 'Details about Video 2', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 3, title: 'Video 3', description: 'Details about Video 3', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 4, title: 'Video 4', description: 'Details about Video 4', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 5, title: 'Video 5', description: 'Details about Video 5', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 6, title: 'Video 6', description: 'Details about Video 6', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 7, title: 'Video 7', description: 'Details about Video 7', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 8, title: 'Video 8', description: 'Details about Video 8', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 9, title: 'Video 9', description: 'Details about Video 9', video: 'https://www.w3schools.com/html/mov_bbb.mp4' }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };


const [parkingData, setParkingData] = useState([]);
console.log("parkingData",parkingData)
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const res = await axios.post("http://parking.parkmont.co.in:8086/AnprParkingProject-0.0.1/api/anpr/parking/list",token: {});
//       setParkingData(res.data.data); // Save the data to state
//     } catch (err) {
//       console.error("API Error:", err);
//     }
//   };

//   fetchData();
// }, []);
useEffect(() => {
    const fetchData = async () => {
      try {
        const token = "your_token_here"; // Replace with your actual token

        const res = await axios.post(
          "http://parking.parkmont.co.in:8086/AnprParkingProject-0.0.1/api/anpr/parking/list",
          {}, // If your POST body is empty
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`, // Or just `token` depending on your backend
          //     "Content-Type": "application/json", // Optional, if your server expects it
          //   },
          // }
        );

        setParkingData(res.data.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {/* <Grid item xs={12}>
          <Typography variant="h5" sx={{ textAlign: 'start' }}>
            ANPR Videos
          </Typography>
        </Grid> */}

        {/* Full-width Search Input with Label */}
        {/* <Grid item xs={12} sx={{ marginTop: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search Videos..."
            sx={{
              backgroundColor: '#fff',
              borderRadius: '5px',
              '& .MuiOutlinedInput-root': {
                height: '60px', // Increases the height of the input
                '& input': {
                  padding: '16px 14px' // Ensures text is vertically aligned
                },
                '&:hover fieldset': {
                  borderColor: '#3a186e' // Outline color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3a186e' // Outline color on focus
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#3a186e' // Label color on focus
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#3a186e' }} />
                </InputAdornment>
              )
            }}
          />
        </Grid> */}

        {/* <Grid item xs={12}>
          <Slider {...settings}>
            {cards.map((card, index) => (
              <Box key={index} sx={{ padding: 1, position: 'relative' }} onClick={() => handleCardClick(card.id, index)}>
                <Card sx={{ maxWidth: 345, margin: '0 auto', position: 'relative' }}>
                  <Box component="div" sx={{ position: 'relative' }}>
                    <video
                      src={vid}
                      width="100%"
                      height="170"
                      style={{ objectFit: 'cover' }}
                      muted
                      disablePictureInPicture
                      controls={false}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginLeft: 0.5 }}>
                        ▶
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ padding: '5px 0px 0px 10px' }}>
                    <Typography variant="h6" component="div">
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Grid> */}
      </Grid>

      {/* Modal Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        sx={{ '& .MuiDialog-paper': { width: '500px', maxWidth: '90%' } }} // Adjust width here
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ color: '#ff9800', marginRight: 2 }} />
            <Typography variant="h6">Please Subscribe to Our Plan First</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You need to subscribe to our plan before you can access the video content. Please visit our subscription page for more details.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12} mt={5}>
        <Typography variant="h5" sx={{ textAlign: 'start' }}>
          ANPR Vehicle List
        </Typography>
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <OrdersTable />
      </MainCard>
    </>
  );
};

export default ANPR;
