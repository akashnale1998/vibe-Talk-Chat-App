const Message = require('../models/Message');
// const redis = require('../redis/redisClient');

// @desc    Get all messages between two users
// @route   GET /api/messages/:from/:to
exports.getMessages = async (req, res) => {
  try {
    const { from, to } = req.params;

    if (!from || !to) {
      return res.status(400).json({ message: 'Both sender and receiver IDs are required' });
    }

    const messages = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from }
      ]
    })
    .populate('from', 'name email avatarUrl')
    .populate('to', 'name email avatarUrl')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Send a new message
// @route   POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { from, to, content } = req.body;

    if (!from || !to || !content) {
      return res.status(400).json({ message: 'Sender, receiver, and content are required' });
    }

    const message = new Message({ from, to, content });
    await message.save();

    const populatedMsg = await Message.findById(message._id)
      .populate('from', 'name email avatarUrl')
      .populate('to', 'name email avatarUrl');

    // ✅ If using Socket.io, emit event here
    if (req.io) {
      req.io.to(to).emit('receive_message', populatedMsg);
    }

    res.status(201).json(populatedMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Mark message as read
// @route   PATCH /api/messages/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Message ID is required' });
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
