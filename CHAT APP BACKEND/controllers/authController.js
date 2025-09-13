const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Check if email is already registered
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new user
    const user = new User({ name, email, password, avatarUrl });
    await user.save();

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Please provide email and password' });
//     }

//    const user = await User.findOne({ email }).select('+password');
// if (!user || !(await user.comparePassword(password))) {
//   return res.status(400).json({ message: 'Invalid credentials' });
// }

//     res.json({
//       token: generateToken(user),
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         avatarUrl: user.avatarUrl
//       }
//     });
//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Save FCM token if provided
    if (fcmToken) {
      await User.updateOne(
        { _id: user._id },
        { $addToSet: { fcmTokens: fcmToken } } // prevents duplicates
      );
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




// @desc    Get all users except the logged-in one
const onlineUsers = new Map(); // Make sure this is shared or imported here

// exports.getUsers = async (req, res) => {
//   try {
//     const loggedInUserId = req.user.id;
//     const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

//     // Map users and add online field
// const usersWithStatus = users.map(user => ({
//   ...user.toObject(),
//   online: user.online, // directly from DB
// }));

//     res.json(usersWithStatus);
//   } catch (err) {
//     console.error('Get Users Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };




exports.getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // Fetch users from DB (exclude the logged-in user)
    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select('-password')
      .lean();

    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        // Count unread messages
        const unreadCount = await Message.countDocuments({
          from: user._id,
          to: loggedInUserId,
          read: false
        });

        // Get last message between users
        const lastMessage = await Message.findOne({
          $or: [
            { from: user._id, to: loggedInUserId },
            { from: loggedInUserId, to: user._id }
          ]
        })
        .sort({ createdAt: -1 })
        .lean();

        return {
          ...user,
          online: user.online, // use the online field from DB
          unreadCount,
          lastMessage: lastMessage ? lastMessage.content : "No messages yet",
          lastMessageTime: lastMessage ? lastMessage.createdAt : null
        };
      })
    );

    res.json(usersWithStatus);
  } catch (err) {
    console.error('Get Users Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

