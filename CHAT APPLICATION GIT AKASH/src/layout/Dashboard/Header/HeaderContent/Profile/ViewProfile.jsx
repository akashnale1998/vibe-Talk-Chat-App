import React from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { Add, Share, Settings } from "@mui/icons-material";
import profile2 from '../../../../../assets/images/users/profile2.jpg';

const ViewProfile = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        mt: 0,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      {/* Background Banner */}
      <Box
        sx={{
          height: 100,
          background: "linear-gradient(to right, #645281, #bdbbb7)",
        }}
      ></Box>

      {/* Profile Section */}
      <Box sx={{ px: 3, pb: 2, display: "flex", alignItems: "center" }}>
        {/* Avatar */}
        <Avatar
          src={profile2} // Replace with the actual image URL
          alt="Profile"
          sx={{
            width: 150,
            height: 150,
            mt: -5,
            border: "3px solid white",
          }}
        />
        {/* User Details */}
        <Box sx={{ ml: 2, flex: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            X_AE_A_15
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip label="Enterprise" size="small" color="success" />
            <Typography variant="body2" color="text.secondary">
              elementary221b@gmail.com
            </Typography>
          </Stack>
        </Box>
        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          <IconButton color="primary">
            <Add />
          </IconButton>
          <IconButton color="primary">
            <Share />
          </IconButton>
          <IconButton color="primary">
            <Settings />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default ViewProfile;
