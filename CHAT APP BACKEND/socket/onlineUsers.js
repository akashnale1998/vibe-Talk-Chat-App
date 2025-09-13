const User = require('../models/User');

module.exports = (io) => {
  const onlineUsers = new Map(); // userId -> [socketIds]

  return {
    addUser: async (userId, socketId) => {
      // console.log(123,onlineUsers)
      const sockets = onlineUsers.get(userId) || [];
      console.log(123,sockets)

      onlineUsers.set(userId, [...sockets, socketId]);

      await User.findByIdAndUpdate(userId, { online: true, lastSeen: null });

      console.log(`✅ ${userId} added. Current online:`, Array.from(onlineUsers.keys()));
      io.emit('online-users', Array.from(onlineUsers.keys()));
    },

    removeUser: async (userId, socketId) => {
      const sockets = onlineUsers.get(userId) || [];
      const updated = sockets.filter(id => id !== socketId);

      if (updated.length === 0) {
        onlineUsers.delete(userId);
        await User.findByIdAndUpdate(userId, { online: false, lastSeen: new Date() });

        console.log(`🚪 ${userId} removed. Current online:`, Array.from(onlineUsers.keys()));
      } else {
        onlineUsers.set(userId, updated);
      }

      io.emit('online-users', Array.from(onlineUsers.keys()));
    },

    getAll: () => Array.from(onlineUsers.keys()),

    getUserSockets: (userId) => onlineUsers.get(userId) || []
  };
};
