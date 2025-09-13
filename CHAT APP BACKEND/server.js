// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const { Server } = require('socket.io');

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const messageRoutes = require('./routes/messageRoutes');

// // Socket
// const initSocket = require('./socket');

// // Create Express app
// const app = express();
// const server = http.createServer(app);

// // Middlewares
// app.use(cors({
//   origin: process.env.CLIENT_URL || true,
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);

// // MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   });

// // Initialize Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || true,
//     credentials: true
//   },
//   allowEIO3: true
// });
// // console.log("IO",io)
// initSocket(io);

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port http://0.0.0.0:5000}`));
// // app.listen(5000, '0.0.0.0', () => {
// //   console.log("Server running on http://0.0.0.0:5000");
// // });






require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

// Routes
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');

// Socket
const initSocket = require('./socket');

// Create Express app
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || true,
    credentials: true
  },
  allowEIO3: true
});
const onlineUsers = new Map();
initSocket(io, onlineUsers);

// Attach io & onlineUsers to req
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
// app.use('/api/notifications', notificationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
