const { verifySocketToken } = require('../utils/socketAuth');
const handleSocketEvents = require('./events');
const createOnlineUsers = require('./onlineUsers'); // modified to accept io

module.exports = (io) => {
  // console.log("io",io)
  // Create onlineUsers instance with io reference
  const onlineUsers = createOnlineUsers(io);
// console.log("onlineUsers",onlineUsers)
  // Socket auth middleware
  io.use(async (socket, next) => {
    // console.log("socket",socket)
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication token missing'));

      const payload = await verifySocketToken(token);
    // console.log("payload",payload)

      socket.userId = payload.id;
      // console.log("socket123",socket)
      next();
    } catch (err) {
      console.error('Socket authentication error:', err.message);
      next(new Error('Authentication error'));
    }
  });

  // Socket connection
  io.on('connection', (socket) => {

    // console.log(123,io)
    const uid = socket.userId;
    console.log(`🟢 User connected: ${uid}, Socket: ${socket.id}`);

    // Add socket to online users (also updates DB + emits automatically)
    onlineUsers.addUser(uid, socket.id);
    // console.log("onlineUsers",onlineUsers.addUser())

    // Link your external events
    handleSocketEvents(io, socket, onlineUsers);

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${uid}, Socket: ${socket.id}`);
      onlineUsers.removeUser(uid, socket.id); // also updates DB + emits automatically
    });
  });
};
