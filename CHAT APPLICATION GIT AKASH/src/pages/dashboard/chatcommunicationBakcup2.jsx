import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { format, isToday, isYesterday } from 'date-fns';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Badge,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  AppBar,
  Toolbar,
  Fab,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Drawer,
  alpha,
  Menu,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  Search as SearchIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  Mic as MicIcon,
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  PersonAdd as PersonAddIcon,
  DeleteOutlined,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
// import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import avatar1 from './../../assets/images/users/avatar-1.png'
import Picker from "emoji-picker-react"; // <- emoji picker

// import Picker from "emoji-picker-react"; // <- emoji picker
import { useNavigate } from "react-router-dom";

// ============== THEME ADDON START ==============
// Theme Context
const ThemeContext = createContext();

const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

// Theme configurations
const getTheme = (mode) => {
  const isLight = mode === 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? '#25d366' : '#00a884',
        light: isLight ? '#4ddd7a' : '#26d367',
        dark: isLight ? '#1aa851' : '#008069',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isLight ? '#128c7e' : '#00a884',
      },
      background: {
        default: isLight ? '#f0f2f5' : '#111b21',
        paper: isLight ? '#ffffff' : '#1f2937',
        chat: isLight ? '#e1f5fe' : '#0b141a',
      },
      text: {
        primary: isLight ? '#111b21' : '#e9edef',
        secondary: isLight ? '#667781' : '#8696a0',
      },
      divider: isLight ? '#e4e6ea' : '#2a3942',
      chat: {
        myBubble: isLight ? '#25d366' : '#005c4b',
        otherBubble: isLight ? '#ffffff' : '#202c33',
        myBubbleText: '#ffffff',
        otherBubbleText: isLight ? '#111b21' : '#e9edef',
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: isLight ? '#c1c1c1 #f1f1f1' : '#3a3a3a #1a1a1a',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight ? '#f1f1f1' : '#1a1a1a',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isLight ? '#c1c1c1' : '#3a3a3a',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: isLight ? '#a8a8a8' : '#4a4a4a',
            },
          },
        },
      },
    },
  });
};

// Theme Provider Component
const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';  // Default to light as requested
  });

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const theme = getTheme(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Theme Toggle Component (to add to your existing header)
const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeMode();
  
  return (
    <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
      <IconButton sx={{ color: 'primary.contrastText' }} onClick={toggleTheme}>
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};
// ============== THEME ADDON END ==============

// Your backend configuration
const SOCKET_SERVER_URL = "http://localhost:5000";

// Styled Components - Updated to use theme
const StyledPaper = styled(Paper)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  borderRadius: 0,
  boxShadow: "none",
  backgroundColor: theme.palette.background.paper,
}));

const ChatListContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.mode === 'light' ? "#f5f5f5" : alpha(theme.palette.background.default, 0.5),
    borderRadius: theme.spacing(3),
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ChatListItem = styled(ListItem)(({ theme, selected }) => ({
  cursor: "pointer",
  backgroundColor: selected ? alpha(theme.palette.primary.main, 0.1) : "transparent",
  borderLeft: selected ? `4px solid ${theme.palette.primary.main}` : "4px solid transparent",
  "&:hover": {
    backgroundColor: selected ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.action.hover, 0.04),
  },
  transition: theme.transitions.create(['background-color', 'border-left'], {
    duration: theme.transitions.duration.short,
  }),
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  backgroundColor: theme.palette.background.chat || (theme.palette.mode === 'light' ? "#e1f5fe" : "#0b141a"),
  backgroundImage: theme.palette.mode === 'light' 
    ? `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%),
       radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 50%),
       radial-gradient(circle at 40% 80%, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 50%)`
    : `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.dark, 0.05)} 0%, transparent 50%),
       radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.dark, 0.05)} 0%, transparent 50%)`,
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
}));

const MessageBubble = styled(Paper)(({ theme, isMe }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: "75%",
  backgroundColor: isMe ? 
    (theme.palette.chat?.myBubble || theme.palette.primary.main) : 
    (theme.palette.chat?.otherBubble || (theme.palette.mode === 'light' ? "#ffffff" : "#202c33")),
  color: isMe ? 
    (theme.palette.chat?.myBubbleText || theme.palette.primary.contrastText) : 
    (theme.palette.chat?.otherBubbleText || theme.palette.text.primary),
  borderRadius: theme.spacing(2),
  borderTopLeftRadius: isMe ? theme.spacing(2) : theme.spacing(0.5),
  borderTopRightRadius: isMe ? theme.spacing(0.5) : theme.spacing(2),
  marginBottom: theme.spacing(1),
  boxShadow: theme.shadows[2],
  position: 'relative',
  '&::after': isMe ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: -8,
    width: 0,
    height: 0,
    borderLeft: `8px solid ${theme.palette.chat?.myBubble || theme.palette.primary.main}`,
    borderBottom: '8px solid transparent',
  } : {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: -8,
    width: 0,
    height: 0,
    borderRight: `8px solid ${theme.palette.chat?.otherBubble || (theme.palette.mode === 'light' ? "#ffffff" : "#202c33")}`,
    borderBottom: '8px solid transparent',
  }
}));

const MessageInput = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.background.paper,
  gap: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledMessageInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.mode === 'light' ? "#f5f5f5" : alpha(theme.palette.background.default, 0.5),
    borderRadius: theme.spacing(3),
    paddingRight: theme.spacing(6),
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const OnlineBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

function WhatsAppChatInner() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  // const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  // const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteForEveryone = (msg) => {
    if (socketRef.current) {
      socketRef.current.emit('delete_message', { messageId: msg._id });
    }
    handleMenuClose();

    // Optimistically remove message locally
    setMessages(prev => prev.filter(m => m._id !== msg._id));
  };

  const handleDeleteForMe = (msg) => {
    if (socketRef.current) {
      socketRef.current.emit('delete_messageForMe', {
        messageId: msg._id,
        userId: loggedInUserId  // send current user id
      });
    }
    handleMenuClose();

    // Optimistically remove message locally for this user
    setMessages(prev => prev.filter(m => m._id !== msg._id));
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Your original authentication and state
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?.id;
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);

  const [typingUsers, setTypingUsers] = useState(new Set());

  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Your original handleSelectUser function
  const handleSelectUser = (userId) => {
    const freshUser = users.find(u => u._id === userId);
    console.log("freshUser", freshUser);
    if (freshUser) {
      setSelectedUser(freshUser);
      if (isMobile) setMobileOpen(false);
    }
  };

  

useEffect(() => {
  if (!socketRef.current) return;

  const socket = socketRef.current;

  // Messages deleted for everyone
  const handleMessageDeleted = (deletedMsg) => {
    setMessages(prev =>
      prev.map(msg =>
        msg._id.toString() === deletedMsg._id.toString()
          ? { ...msg, deleteForEveryone: true }
          : msg
      )
    );
  };

  // Messages deleted for me
  const handleMessageDeletedForMe = ({ messageId }) => {
    setMessages(prev => prev.filter(msg => msg._id.toString() !== messageId.toString()));
  };

  // Online/offline users
  const handleOnlineUsers = (onlineUserIds) => {
    setUsers(prevUsers =>
      prevUsers.map(user => ({
        ...user,
        online: onlineUserIds.map(String).includes(user._id.toString()),
      }))
    );

    setSelectedUser(prev => {
      if (!prev) return prev;
      const isOnline = onlineUserIds.map(String).includes(prev._id.toString());
      return prev.online !== isOnline ? { ...prev, online: isOnline } : prev;
    });
  };

  // Message delivered/read updates
  const handleMessageStatusUpdate = ({ id, delivered, read }) => {
    setMessages(prev =>
      prev.map(msg =>
        msg._id.toString() === id.toString()
          ? { ...msg, delivered: delivered ?? msg.delivered, read: read ?? msg.read }
          : msg
      )
    );
  };

  
  // Private messages
 const handlePrivateMessage = (message) => {
    // Only handle messages relevant to the selected user
    if (
      (message.from === selectedUser?._id && message.to === loggedInUserId) ||
      (message.to === selectedUser?._id && message.from === loggedInUserId)
    ) {
      setMessages(prev => [...prev, message]);

      // Notify server to mark as delivered if this message is sent to me
      if (message.to === loggedInUserId) {
        socket.emit("message_delivered", message._id); // emit **only the ID**
      }
    }
  };
  // Subscribe to socket events
  socket.on('delete_message', handleMessageDeleted);
  socket.on('delete_messageForMe', handleMessageDeletedForMe);
  socket.on('online-users', handleOnlineUsers);
  socket.on('message_delivered', handleMessageStatusUpdate);
  socket.on('message_read', handleMessageStatusUpdate);
  socket.on('private-message', handlePrivateMessage);

  // Cleanup
  return () => {
    socket.off('delete_message', handleMessageDeleted);
    socket.off('delete_messageForMe', handleMessageDeletedForMe);
    socket.off('online-users', handleOnlineUsers);
    socket.off('message_delivered', handleMessageStatusUpdate);
    socket.off('message_read', handleMessageStatusUpdate);
    socket.off('private-message', handlePrivateMessage);
  };
}, [loggedInUserId, selectedUser]);


useEffect(() => {
  if (!socketRef.current) return;

  socketRef.current.on("typing", ({ from, isTyping }) => {
    if (from === selectedUser?._id) {
      setSelectedUser((prev) => ({ ...prev, isTyping }));
    }
  });

  return () => socketRef.current.off("typing");
}, [selectedUser?._id]);


  // Your original fetch users effect
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const response = await fetch("http://localhost:5000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUsers(data);
        // handleOnlineUsers(users)
      } catch (error) {
        setErrorUsers("Failed to load users");
        console.error(error);
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, [token]);

  // Your original reset search effect
  useEffect(() => {
    setFilteredUsers(null);
    setSearchQuery("");
  }, [users, selectedUser]);

  // Your original search function
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(null);
      return;
    }
    const query = searchQuery.trim().toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const usersToShow = filteredUsers !== null ? filteredUsers : users;

  // Your original fetch messages effect
// Fetch messages when selected user changes
useEffect(() => {
  if (!selectedUser || !loggedInUserId) {
    setMessages([]);
    return;
  }

  const fetchMessages = async () => {
    console.log(11,selectedUser._id)
    console.log(111,loggedInUserId)

    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/${loggedInUserId}/${selectedUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
console.log("data",data)
      setMessages(
        data?.map(msg => ({
          ...msg,
          delivered: msg.delivered ?? false,
          read: msg.read ?? false,
        }))
      );

      // ✅ Remove client-side emitted delivered
      // The server already handles marking delivered for online recipients
    } catch (err) {
      console.error(err);
    }
  };

  fetchMessages();
}, [selectedUser, loggedInUserId, token]);

// Socket initialization
useEffect(() => {
  if (!loggedInUserId) return;

  const initSocket = async () => {
    const { io } = await import("socket.io-client");
    const socket = io(SOCKET_SERVER_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", loggedInUserId);
    });

    // Online users
    socket.on("online-users", onlineUserIds => {
      setUsers(prev => prev.map(u => ({ ...u, online: onlineUserIds.includes(u._id) })));
      setSelectedUser(prev => {
        if (!prev) return prev;
        const isOnline = onlineUserIds.includes(prev._id);
        return prev.online !== isOnline ? { ...prev, online: isOnline } : prev;
      });
    });

    // Private messages
    socket.on("private-message", message => {
      if (
        (message.from === selectedUser?._id && message.to === loggedInUserId) ||
        (message.to === selectedUser?._id && message.from === loggedInUserId)
      ) {
        setMessages(prev => [...prev, message]);

        // ✅ Only emit ID
        if (message.to === loggedInUserId) {
          socket.emit("message_delivered", message._id);
        }
      }
    });

    // Typing
    socket.on("typing", ({ from, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) newSet.add(from);
        else newSet.delete(from);
        return newSet;
      });
    });

    // Delivered / Read updates
 // Delivered updates
 socket.on("message_delivered", (messageId) => {
      setMessages(prev => prev.map(msg =>
        msg._id.toString() === messageId.toString() ? { ...msg, delivered: true } : msg
      ));
    });
    socket.on("message_read", messageId => {
      setMessages(prev =>
        prev.map(msg => (msg._id.toString() === messageId.toString() ? { ...msg, read: true } : msg))
      );
    });
  };

  initSocket();

  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };
}, [loggedInUserId, token, selectedUser]);

  // Your original emit read status effect
  useEffect(() => {
    if (!selectedUser || !socketRef.current) return;

    messages.forEach((msg) => {
      if (!msg.read && msg.from === selectedUser._id) {
        socketRef.current.emit("message_read", { messageId: msg._id });
      }
    });
  }, [selectedUser, messages]);

  // Auto scroll messages to bottom on update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Your original send message handler
  const handleSend = () => {
    if (!text.trim() || !selectedUser || !socketRef.current) return;

    const tempId = Date.now().toString();

    const message = {
      _id: tempId,
      from: loggedInUserId,
      to: selectedUser._id,
      content: text.trim(),
      createdAt: new Date().toISOString(),
      delivered: false,
      read: false,
      temp: true,
    };

    setMessages(prev => [...prev, message]);
    socketRef.current.emit("private-message", message);
    setText("");
  };

  // Your original handle text change function
const typingTimeoutRef = useRef(null);

const handleTextChange = (e) => {
  const value = e.target.value;
  setText(value);

  if (!socketRef.current || !selectedUser) return;

  // Emit typing = true when user starts typing
  socketRef.current.emit("typing", {
    to: selectedUser._id,
    isTyping: value.length > 0,
  });

  // Clear old timeout
  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

  // Auto-stop typing after 2 seconds of inactivity
  typingTimeoutRef.current = setTimeout(() => {
    socketRef.current.emit("typing", {
      to: selectedUser._id,
      isTyping: false,
    });
  }, 2000);
};


  // Your original utility functions
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getLastSeenText = (lastSeen) => {
  if (!lastSeen) return '';
  const date = new Date(lastSeen);

  if (isToday(date)) return `Today at ${format(date, 'hh:mm a')}`;
  if (isYesterday(date)) return `Yesterday at ${format(date, 'hh:mm a')}`;
  
  return format(date, 'dd/MM/yyyy hh:mm a');
};

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    localStorage.removeItem("user"); // remove token

    navigate("/login"); // redirect to login
  };
  const drawer = (
    <ChatListContainer>
      <ChatHeader>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'primary.contrastText',
                color: 'primary.main',
                width: 48,
                height: 48,
              }}
            >
              <ChatIcon />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              VibeTalk
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <ThemeToggle />
            <Tooltip title="New Group">
              <IconButton sx={{ color: 'primary.contrastText' }}>
                <GroupIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Menu">
              <IconButton sx={{ color: 'primary.contrastText' }}
                onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Stack>
        </Box>
      </ChatHeader>

      <SearchContainer>
        <StyledTextField
          fullWidth
          size="small"
          placeholder="Search or start new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      {loadingUsers && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress size={32} />
          <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
            Loading chats...
          </Typography>
        </Box>
      )}

      {errorUsers && (
        <Card sx={{ m: 2, bgcolor: 'error.light' }}>
          <CardContent>
            <Typography variant="body2" color="error.contrastText">
              {errorUsers}
            </Typography>
          </CardContent>
        </Card>
      )}

      <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
        {usersToShow.map((user, index) => (
          <React.Fragment key={user._id}>
            <ChatListItem
              selected={selectedUser?._id === user._id}
              onClick={() => handleSelectUser(user._id)}
            >
              <ListItemAvatar>
                {user.online ? (
                  <OnlineBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      src={user.avatar1}
                      sx={{
                        bgcolor: user.avatar ? 'transparent' : 'primary.main',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {!user.avatar && getInitials(user.name)}
                    </Avatar>
                  </OnlineBadge>
                ) : (
                  <Avatar
                    src={avatar1}
                    sx={{
                      bgcolor: user.avatar ? 'transparent' : 'grey.400',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {!user.avatar && getInitials(user.name)}
                  </Avatar>
                )}
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      
                     {user.online ? 'online' : getLastSeenText(user.lastSeen)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        mr: 1,
                      }}
                    >
                      {user.lastMessage || "No messages yet"}
                    </Typography>
                    {user.unreadCount > 0 && (
                      <Chip
                        label={user.unreadCount}
                        size="small"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                }
              />
            </ChatListItem>
            {index < usersToShow.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </ChatListContainer>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 320 },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Sidebar for desktop */}
      {!isMobile && (
        <Box sx={{ width: 380, flexShrink: 0 }}>
          {drawer}
        </Box>
      )}

      {/* Chat Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <StyledPaper>
            {/* Chat Header */}
            <AppBar position="static" elevation={1}>
              <Toolbar>
                <Box display="flex" alignItems="center" flexGrow={1}>
                  {isMobile && (
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleDrawerToggle}
                      sx={{ mr: 2 }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}

                  <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
                    {selectedUser.online ? (
                      <OnlineBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                      >
                        <Avatar
                          src={selectedUser.avatar ||avatar1}
                          sx={{ bgcolor: selectedUser.avatar ? 'transparent' : 'primary.contrastText' }}
                        >
                          {!selectedUser.avatar && getInitials(selectedUser.name)}
                        </Avatar>
                      </OnlineBadge>
                    ) : (
                      <Avatar
                        src={selectedUser.avatar ||avatar1}
                        sx={{ bgcolor: selectedUser.avatar ? 'transparent' : 'primary.contrastText' }}
                      >
                        {!selectedUser.avatar && getInitials(selectedUser.name)}
                      </Avatar>
                    )}

                    <Box>
 <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {selectedUser.name}
    </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {typingUsers.has(selectedUser._id) ? (
                          <span style={{ color: '#4caf50' }}>typing...</span>
                        ) : selectedUser.online ? (
                          "Online"
                        ) : selectedUser.lastSeen ? (
                          (() => {
                            const lastSeenDate = new Date(selectedUser.lastSeen);
                            if (isToday(lastSeenDate)) {
                              return `Last seen today at ${format(lastSeenDate, 'HH:mm')}`;
                            } else if (isYesterday(lastSeenDate)) {
                              return `Last seen yesterday at ${format(lastSeenDate, 'HH:mm')}`;
                            } else {
                              return `Last seen on ${format(lastSeenDate, 'dd/MM/yyyy HH:mm')}`;
                            }
                          })()
                        ) : (
                          "Offline"
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Video Call">
                    <IconButton color="inherit">
                      <VideocamIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Voice Call">
                    <IconButton color="inherit">
                      <PhoneIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More">
                    <IconButton color="inherit">
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Toolbar>
            </AppBar>

            {/* Messages */}
            <MessagesContainer>
              {loadingMessages && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                    Loading messages...
                  </Typography>
                </Box>
              )}

              {errorMessages && (
                <Card sx={{ bgcolor: 'error.light', mb: 2 }}>
                  <CardContent>
                    <Typography variant="body2" color="error.contrastText">
                      {errorMessages}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {messages.reduce((acc, msg, index) => {
                  const isMe = String(msg.from?._id || msg.from) === String(loggedInUserId);

                  const currentMsgDate = new Date(msg.createdAt).toDateString();
                  const prevMsgDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;

                  // Add date separator if new day
                  if (currentMsgDate !== prevMsgDate) {
                    acc.push(
                      <Box key={`date-${msg._id}`} sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                        <Typography variant="caption" sx={{ bgcolor: 'primary.light', px: 2, py: 0.5, borderRadius: 2, color: 'primary.contrastText' }}>
                          {currentMsgDate === new Date().toDateString() ? 'Today' : currentMsgDate}
                        </Typography>
                      </Box>
                    );
                  }
                  const isDeleted = msg.deleteForEveryone;
                  const isDeletedForMe = msg.deletedFor?.some(id => String(id) === String(loggedInUserId)) || false;

                  // console.log("isDeletedForMe",isDeletedForMe)
                  // Push the message bubble
                  acc.push(
                    <Box
                      key={msg._id}
                      sx={{
                        display: 'flex',
                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {!isDeletedForMe && (
                        <MessageBubble isMe={isMe} elevation={1}>
                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              mb: 0.5,
                              fontSize: msg.content.match(/\p{Emoji}/u) ? '2rem' : '1rem',
                            }}
                          >
                            {isDeleted ? 'This message was deleted' : msg.content}
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              gap: 0.5,
                              opacity: 0.8,
                              position: 'relative',
                            }}
                          >
                            <Typography variant="caption">{formatTime(msg.createdAt)}</Typography>

                            {isMe && !msg.deleteForEveryone && (
                              <>
                                {msg.read ? (
                                  <DoneAllIcon sx={{ fontSize: 16, color: '#4fc3f7' }} />
                                ) : msg.delivered ? (
                                  <DoneAllIcon sx={{ fontSize: 16 }} />
                                ) : (
                                  <DoneIcon sx={{ fontSize: 16 }} />
                                )}
                              </>
                            )}

                            {/* Menu Button always visible */}
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', top: 0, right: -28 }}
                              onClick={(e) => handleMenuClick(e, msg)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>

                            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                              {/* Delete for Everyone only if it's your message */}
                              {/* {isMe && !msg.deleteForEveryone && ( */}
                                <MenuItem onClick={() => handleDeleteForEveryone(msg)}>
                                  <DeleteOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  Delete for Everyone
                                </MenuItem>
                              {/* )} */}

                              {/* Delete for Me always available unless deleted for everyone */}
                              {/* {!msg.deleteForEveryone && ( */}
                                <MenuItem onClick={() => handleDeleteForMe(msg)}>
                                  <DeleteOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  Delete for Me
                                </MenuItem>
                              {/* )} */}
                            </Menu>
                          </Box>
                        </MessageBubble>
                      )}
                    </Box>

                  );

                  return acc;
                }, [])}
                <div ref={messagesEndRef} />
              </Box>
            </MessagesContainer>


            {/* Message Input */}
            <MessageInput>
              <Tooltip title="Attach File">
                <IconButton color="primary">
                  <AttachFileIcon />
                </IconButton>
              </Tooltip>

              <Box sx={{ flex: 1, position: 'relative' }}>
                <StyledMessageInput
                  fullWidth
                  placeholder="Type a message..."
                  value={text}
                  onChange={handleTextChange}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  multiline
                  maxRows={4}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                  onClick={() => setShowEmojiPicker((val) => !val)}
                >
                  <EmojiEmotionsIcon color="action" />
                  {showEmojiPicker && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "100%",
                        right: 0,
                        zIndex: 10,
                      }}
                    >
                      <Picker onEmojiClick={onEmojiClick} />
                    </Box>
                  )}
                </IconButton>
              </Box>

              {text.trim() ? (
                <Fab
                  color="primary"
                  size="medium"
                  onClick={handleSend}
                  sx={{ ml: 1 }}
                >
                  <SendIcon />
                </Fab>
              ) : (
                <Tooltip title="Voice Message">
                  <IconButton color="primary" size="large">
                    <MicIcon />
                  </IconButton>
                </Tooltip>
              )}
            </MessageInput>
          </StyledPaper>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: 'grey.50',
              textAlign: 'center',
              p: 4,
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                mb: 3,
              }}
            >
              <ChatIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'Black' }}>
              Welcome to VibeTalk
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 480 }}>
              {loggedInUser ?
                `Hello ${loggedInUser.name || loggedInUser.email}! Select a conversation to start chatting with your friends and colleagues.` :
                'Please log in to start chatting with your friends and colleagues.'
              }
            </Typography>
            {isMobile && (
              <Fab
                color="primary"
                variant="extended"
                onClick={handleDrawerToggle}
                sx={{ mt: 2 }}
              >
                <ChatIcon sx={{ mr: 1 }} />
                Open Chats
              </Fab>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function WhatsAppChat() {
  return (
    <CustomThemeProvider>
      <WhatsAppChatInner />
    </CustomThemeProvider>
  );
}