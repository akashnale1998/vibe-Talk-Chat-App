import PropTypes from 'prop-types';
import React from 'react';

// Material-UI Components
import { Card, CardContent, Grid, Typography, Box, Avatar } from '@mui/material';
import { green, red } from '@mui/material/colors';

// Icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
const AnalyticCard = ({ title, count, percentage, isIncrease, lastMonthText }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Icon */}
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: '#e9e3f3',
                color: '#3a186e',
                width: 65,
                height: 65,
              }}
            >
              <DriveEtaIcon  sx={{ fontSize: 42 }} />
            </Avatar>
          </Grid>

          {/* Main Info */}
          <Grid item xs>
            <Typography variant="h5" sx={{ fontWeight: 600, fontSize:'1.2rem' }}>
              {count}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize={'0.95rem'}>
              {title}
            </Typography>
          </Grid>
        </Grid>

        {/* Percentage and Last Month */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          {isIncrease ? (
            <ArrowUpwardIcon fontSize="small" sx={{ color: green[500], marginRight: 0.5 }} />
          ) : (
            <ArrowDownwardIcon fontSize="small" sx={{ color: red[500], marginRight: 0.5 }} />
          )}
          <Typography
            variant="body2"
            sx={{ color: isIncrease ? green[500] : red[500], fontWeight: 600 }}
          >
            {percentage}%
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginLeft: 0.5 }}
          >
            {lastMonthText}
          </Typography>
        </Box> */}
      </CardContent>
    </Card>
  );
};

AnalyticCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  isIncrease: PropTypes.bool.isRequired,
  lastMonthText: PropTypes.string.isRequired,
};

export default AnalyticCard;
