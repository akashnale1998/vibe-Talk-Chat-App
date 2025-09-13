import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map(); // Store event listeners for cleanup
    this.isConnected = false;
  }

  // Initialize socket connection
  connect(serverUrl, token, userId) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(serverUrl, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.socket.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Generic event listener with automatic cleanup tracking
  on(event, callback) {
    if (!this.socket) return;
    
    this.socket.on(event, callback);
    
    // Store for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove specific event listener
  off(event, callback) {
    if (!this.socket) return;
    
    this.socket.off(event, callback);
    
    // Remove from tracking
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // === CHAT SPECIFIC METHODS ===

  // Send private message
  sendMessage(message) {
    this.emit('private-message', message);
  }

  // Handle typing status
  setTyping(to, isTyping) {
    this.emit('typing', { to, isTyping });
  }

  // Mark message as delivered
  markDelivered(messageId) {
    this.emit('message_delivered', messageId);
  }

  // Mark message as read
  markRead(messageId) {
    this.emit('messages_read', { messageId });
  }

  // Delete message for everyone
  deleteMessage(messageId) {
    this.emit('delete_message', { messageId });
  }

  // Delete message for me
  deleteMessageForMe(messageId, userId) {
    this.emit('delete_messageForMe', { messageId, userId });
  }


  // Send notification to a target user
// sendNotification(message, targetUserId) {
//   this.emit("sendNotification", { message, targetUserId });
// }

// Listen for incoming notifications
onNotification(callback) {
  this.on("receiveNotification", callback);
}

// Remove listener for notifications
offNotification(callback) {
  this.off("receiveNotification", callback);
}

sendNotification({ title, body, data }, targetUserId) {
  this.emit("sendNotification", {
    message: { title, body, data },
    targetUserId,
  });
}
  // === EVENT HANDLERS SETUP ===

  // Setup all chat-related event listeners
  setupChatListeners({
    onMessage,
    onTyping,
    onOnlineUsers,
    onMessageDelivered,
    onMessageRead,
    onMessageDeleted,
    onMessageDeletedForMe
  }) {
    // Private messages
    this.on('private-message', onMessage);

    // Typing status
    this.on('typing', onTyping);

    // Online users
    this.on('online-users', onOnlineUsers);

    // Message status updates
    this.on('message_delivered', onMessageDelivered);
    this.on('messages_read', onMessageRead);

    // Message deletions
    this.on('delete_message', onMessageDeleted);
    this.on('delete_messageForMe', onMessageDeletedForMe);
  }

  // Clean up all listeners
  cleanup() {
    if (this.socket) {
      // Remove all tracked listeners
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.listeners.clear();
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;