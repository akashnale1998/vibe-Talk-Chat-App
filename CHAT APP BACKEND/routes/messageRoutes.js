const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markAsRead } = require('../controllers/messageController');

router.get('/:from/:to', getMessages); // Get all messages between two users
router.post('/', sendMessage);         // Send a message
router.put('/:id/read', markAsRead); // Mark as read

module.exports = router;
