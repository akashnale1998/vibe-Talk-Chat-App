const express = require('express');
const User = require('../models/User');
const { sendPushToUser } = require('../server/notify');

const router = express.Router();

// Register FCM token
router.post('/token', async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) return res.status(400).json({ error: 'Missing fields' });

  await User.updateOne(
    { _id: userId },
    { $addToSet: { fcmTokens: token } }, // prevents duplicates
    { upsert: true }
  );

  res.json({ ok: true });
});

// Send notification (Socket.IO + FCM fallback)
router.post('/send', async (req, res) => {
  const { toUserId, title, body, data } = req.body;
  if (!toUserId || !title || !body) return res.status(400).json({ error: 'Missing fields' });

  const socketId = req.io?.onlineUsers?.get(toUserId);

  if (socketId) {
    req.io.to(socketId).emit('notification', { title, body, data });
    return res.json({ ok: true, via: 'socket' });
  }

  const result = await sendPushToUser(toUserId, { title, body, data });
  res.json({ ok: result.ok, via: 'fcm', ...result });
});

module.exports = router;
