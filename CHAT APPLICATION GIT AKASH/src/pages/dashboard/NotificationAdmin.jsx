import { useEffect, useState } from "react";
import { Box, TextField, Button, Paper, Typography, Stack } from "@mui/material";
import socketService from "../socketService/socketService";

export default function AdminNotification({ serverUrl, token, adminUserId }) {
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState("");

  useEffect(() => {
    // Connect socket if not already connected
    if (!socketService.isConnected) {
      socketService.connect(serverUrl, token, adminUserId);
    }

    const handleConnect = () => {
      console.log("Socket connected:", socketService.getConnectionStatus().socketId);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected, will try to reconnect...");
    };

    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);

    return () => {
      socketService.off("connect", handleConnect);
      socketService.off("disconnect", handleDisconnect);
    };
  }, [serverUrl, token, adminUserId]);

  const sendNotification = () => {
    if (message && targetUserId) {
      socketService.emit("sendNotification", { message, targetUserId });
      setMessage("");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 4,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" color="primary" gutterBottom>
        Admin Notification Panel
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Target User ID"
          variant="outlined"
          fullWidth
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
        />
        <TextField
          label="Notification Message"
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={3}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={sendNotification}
          sx={{ textTransform: "none", fontSize: "16px", py: 1.2 }}
        >
          Send Notification
        </Button>
      </Stack>
    </Paper>
  );
}
