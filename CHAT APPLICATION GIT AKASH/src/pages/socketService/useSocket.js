import { useEffect, useRef, useCallback } from 'react';
import socketService from './socketService';

// Custom hook for socket operations
export const useSocket = (serverUrl, token, userId) => {
  const isInitialized = useRef(false);

  // Initialize socket connection
  useEffect(() => {
    if (!userId || !token || isInitialized.current) return;

    socketService.connect(serverUrl, token, userId);
    isInitialized.current = true;

    return () => {
      socketService.disconnect();
      isInitialized.current = false;
    };
  }, [serverUrl, token, userId]);

  // Memoized socket operations
  const sendMessage = useCallback((message) => {
    socketService.sendMessage(message);
  }, []);

  const setTyping = useCallback((to, isTyping) => {
    socketService.setTyping(to, isTyping);
  }, []);

  const markDelivered = useCallback((messageId) => {
    socketService.markDelivered(messageId);
  }, []);

  const markRead = useCallback((messageId) => {
    socketService.markRead(messageId);
  }, []);

  const deleteMessage = useCallback((messageId) => {
    socketService.deleteMessage(messageId);
  }, []);

  const deleteMessageForMe = useCallback((messageId, userId) => {
    socketService.deleteMessageForMe(messageId, userId);
  }, []);

  const setupListeners = useCallback((handlers) => {
    socketService.setupChatListeners(handlers);
  }, []);

  const getConnectionStatus = useCallback(() => {
    return socketService.getConnectionStatus();
  }, []);
const sendNotification = useCallback((message, targetUserId) => {
  socketService.emit("sendNotification", { message, targetUserId });
}, []);

const onNotification = useCallback((callback) => {
  socketService.on("receiveNotification", callback);
}, []);

const offNotification = useCallback((callback) => {
  socketService.off("receiveNotification", callback);
}, []);



  return {
    sendMessage,
    setTyping,
    markDelivered,
    markRead,
    deleteMessage,
    deleteMessageForMe,
    setupListeners,
    getConnectionStatus,
    sendNotification,   // new
  onNotification,     // new
  offNotification,    // new
  socketService

  };
};

// Custom hook for managing chat messages with socket integration
export const useChatSocket = (serverUrl, token, loggedInUserId, selectedUser) => {
  const socket = useSocket(serverUrl, token, loggedInUserId);

  // Setup chat-specific event handlers
  const setupChatHandlers = useCallback((handlers) => {
    
    const {
      setMessages,
      users,
      setUsers,
      setSelectedUser,
      setTypingUsers
    } = handlers;

    socket.setupListeners({
      // Handle incoming messages
      onMessage: (message) => {
        console.log("message",message)
        console.log("users",users)

        // Only handle messages relevant to the selected user
        if (
          (message.from === selectedUser?._id && message.to === loggedInUserId) ||
          (message.to === selectedUser?._id && message.from === loggedInUserId)
        ) {
          setMessages(prev => [...prev, message]);

          // Mark as delivered if message is for me
          if (message.to === loggedInUserId) {
            socket.markDelivered(message._id);
          }
        }
      },

      // Handle typing status
      onTyping: ({ from, isTyping }) => {
        if (setTypingUsers) {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            if (isTyping) newSet.add(from);
            else newSet.delete(from);
            return newSet;
          });
        }

        // Update selected user typing status
        if (from === selectedUser?._id && setSelectedUser) {
          setSelectedUser(prev => prev ? { ...prev, isTyping } : prev);
        }
      },

      // Handle online users
      onOnlineUsers: (onlineUserIds) => {
        setUsers(prev => 
          prev.map(user => ({
            ...user,
            online: onlineUserIds.map(String).includes(user._id.toString()),
          }))
        );

        if (setSelectedUser) {
          setSelectedUser(prev => {
            if (!prev) return prev;
            const isOnline = onlineUserIds.map(String).includes(prev._id.toString());
            return prev.online !== isOnline ? { ...prev, online: isOnline } : prev;
          });
        }
      },

      // Handle message delivered
      onMessageDelivered: (messageId) => {
        console.log("messageId",messageId)
        setMessages(prev => 
          prev.map(msg =>
            msg._id.toString() === messageId?.id.toString() 
              ? { ...msg, delivered: true } 
              : msg
          )
        );
      },

      // Handle message read
      onMessageRead: (messageId) => {
        setMessages(prev =>
          prev.map(msg => 
            msg._id.toString() === messageId.toString() 
              ? { ...msg, read: true } 
              : msg
          )
        );
      },

      // Handle message deleted for everyone
      onMessageDeleted: (deletedMsg) => {
        setMessages(prev =>
          prev.map(msg =>
            msg._id.toString() === deletedMsg._id.toString()
              ? { ...msg, deleteForEveryone: true }
              : msg
          )
        );
      },

      // Handle message deleted for me
      onMessageDeletedForMe: ({ messageId }) => {
        setMessages(prev => 
          prev.filter(msg => msg._id.toString() !== messageId.toString())
        );
      }
    });
  }, [socket, selectedUser?._id, loggedInUserId]);

  return {
    ...socket,
    setupChatHandlers
  };
};