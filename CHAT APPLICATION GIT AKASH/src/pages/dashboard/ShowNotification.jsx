import { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from "@mui/material";
import socketService from "../socketService/socketService"; // default import

export default function ShowNotification({ serverUrl = "http://localhost:5000", token, userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect socket if not connected
    if (!socketService.isConnected) {
      socketService.connect(serverUrl, token, userId);
    }

    // Listener for incoming notifications
    const handleNotification = (message) => {
      setNotifications((prev) => [message, ...prev]);
    };

    socketService.on("receiveNotification", handleNotification);

    // Cleanup on unmount
    return () => {
      socketService.off("receiveNotification", handleNotification);
    };
  }, [serverUrl, token, userId]);

  return (
    <Box sx={{ maxWidth: 500, margin: "40px auto", padding: 2 }}>
      <Paper elevation={4} sx={{ borderRadius: 3, padding: 3 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Live Notifications
        </Typography>

        {notifications.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No notifications yet.
          </Typography>
        ) : (
          <List>
            {notifications.map((msg, i) => (
              <Box key={i}>
                <ListItem>
                  <ListItemText
                    primary={msg}
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
                {i !== notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
