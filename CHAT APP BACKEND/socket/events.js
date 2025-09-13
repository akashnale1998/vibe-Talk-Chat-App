const User = require('../models/User');
const Message = require('../models/Message');
const { sendPushToUser } = require('../server/notify');
// const { sendPushToUser } = require('..');
module.exports = (io, socket, onlineUsers) => {
  // console.log("IO is :",io,"socket is:",socket,"onlineusers is:",onlineUsers)
  const uid = socket.userId;
// console.log("uid",uid)
  // Join personal room
  socket.join(uid);
// console.log("socket",socket)

  // Typing indicator
  socket.on('typing', ({ to, isTyping }) => {
    io.to(to).emit('typing', { from: uid, isTyping });
  });

  // Private message
 socket.on('private-message', async ({ to, content }) => {
  try {
    const message = await Message.create({
      from: uid,
      to,
      content,
      delivered: false,
      read: false,
    });

    // Emit to recipient
    io.to(to).emit('private-message', message);

    // Immediately mark as delivered if recipient is online
    const recipientSockets = onlineUsers.getUserSockets(to);
    console.log("recipientSockets",recipientSockets)
    if (recipientSockets && recipientSockets.length > 0) {
      const updatedMsg = await Message.findByIdAndUpdate(
        message._id,
        { delivered: true },
        { new: true }
      );
    console.log("updatedMsg",updatedMsg._id)

      if (updatedMsg) {
        // Notify sender that message is delivered
        io.to(uid).emit('message_delivered', {
          id: updatedMsg._id,
          delivered: true
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
});
// ✅ Explicit message_delivered acknowledgment from recipient
socket.on("message_delivered", async (messageId) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      messageId,
      { delivered: true },
      { new: true }
    );
    if (updated) {
      io.to(updated.from.toString()).emit("message_delivered", updated._id);
    }
  } catch (err) {
    console.error("Error updating delivery:", err);
  }
});

  // Message delivered
  // socket.on('message_delivered', async ({ messageId }) => {
  //   try {
  //     // Find the message
  //     console.log("messageId", messageId)

  //     const message = await Message.findById(messageId);
  //     console.log("message", message)

  //     if (!message) return;

  //     const recipientId = message.to.toString();
  //     console.log("recipientId", recipientId)
  //     // Check if recipient is online
  //     const recipientSockets = onlineUsers.getUserSockets(recipientId);
  //     console.log("recipientSockets", recipientSockets)

  //     if (!recipientSockets || recipientSockets.length === 0) {
  //       console.log(`User ${recipientId} is offline. Not marking delivered.`);
  //       return;
  //     }
  //     console.log("deleverd ")
  //     // Mark as delivered
  //     const updatedMsg = await Message.findByIdAndUpdate(
  //       messageId,
  //       { delivered: true },
  //       { new: true }
  //     );
  //     console.log("updatedMsg", updatedMsg)
  //     if (updatedMsg) {
  //       // Notify sender about delivered status
  //       io.to(updatedMsg.from.toString()).emit('message_delivered', { id: messageId, delivered: true });
  //     }
  //   } catch (err) {
  //     console.error('Error updating delivered status:', err);
  //   }
  // });

  // Message read
  socket.on('message_read', async ({ messageId }) => {
    try {
      const updatedMsg = await Message.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );
      if (updatedMsg) {
        io.to(updatedMsg.from.toString()).emit('message_read', { id: messageId, read: true });
      }
    } catch (err) {
      console.error('Error updating read status:', err);
    }
  });


  // Message delete for everyone
  socket.on('delete_message', async ({ messageId }) => {
    try {
      const updatedMsg = await Message.findByIdAndUpdate(
        messageId,
        { deleteForEveryone: true },
        { new: true }
      );

      if (updatedMsg) {
        // Emit to both sender and receiver
        io.to(updatedMsg.from.toString()).emit('message_deleted', updatedMsg);
        io.to(updatedMsg.to.toString()).emit('message_deleted', updatedMsg);
      }
    } catch (err) {
      console.error('Error deleting message for everyone:', err);
    }
  });

  // Message delete for me (per-user)
  socket.on('delete_messageForMe', async ({ messageId, userId }) => {
    try {
      console.log(122, messageId, userId)
      const updatedMsg = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { deletedFor: userId } } // add userId to deletedFor array
        // { new: true }
      );

      if (updatedMsg) {
        io.to(userId).emit('message_deletedForMe', { messageId });
      }
    } catch (err) {
      console.error('Error deleting message for me:', err);
    }
  });


   socket.on("sendNotification", ({ message, targetUserId }) => {
    console.log("message",message)
    const target = onlineUsers.find(user => user.userId === targetUserId);
    if (target) {
      io.to(target.socketId).emit("receiveNotification", message);
    }
  });



    // Example: Chat message event
  socket.on('send-message', async ({ to, message }) => {
    const targetSocketId = onlineUsers.getSocketId(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('receive-message', { from: socket.userId, message });
    } else {
      await sendPushToUser(to, {
        title: 'New Message',
        body: message,
        data: { from: socket.userId }
      });
    }
  });

  // Notification event
  socket.on('send-notification', async ({ toUserId, title, body, data }) => {
    const targetSocketId = onlineUsers.getSocketId(toUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('notification', { title, body, data });
    } else {
      await sendPushToUser(toUserId, { title, body, data });
    }
  });

};
