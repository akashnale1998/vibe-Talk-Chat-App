// Socket configuration file
export const SOCKET_CONFIG = {
  // Server URL - change this for different environments
  SERVER_URL: process.env.REACT_APP_SOCKET_URL || "http://localhost:5000",
  
  // Connection options
  CONNECTION_OPTIONS: {
    timeout: 20000,
    retries: 3,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
  
  // Event names - centralized for consistency
  EVENTS: {
    // Connection events
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    JOIN: 'join',
    
    // Message events
    PRIVATE_MESSAGE: 'private-message',
    MESSAGE_DELIVERED: 'message_delivered',
    MESSAGE_READ: 'message_read',
    DELETE_MESSAGE: 'delete_message',
    DELETE_MESSAGE_FOR_ME: 'delete_messageForMe',
    
    // User status events
    ONLINE_USERS: 'online-users',
    TYPING: 'typing',
    
    // Room events (for future group chat)
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    ROOM_MESSAGE: 'room_message',
  },
  
  // Typing timeout duration
  TYPING_TIMEOUT: 2000,
  
  // Message status
  MESSAGE_STATUS: {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed'
  }
};

// API endpoints configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  ENDPOINTS: {
    USERS: '/auth/users',
    MESSAGES: (userId, targetUserId) => `/messages/${userId}/${targetUserId}`,
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  }
};

// Helper function to get auth headers
export const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});