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
import avatar1 from './../../assets/images/users/avatar-1.png'
import Picker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";

// Import socket services
import { useChatSocket } from '../socketService/useSocket';

// ============== THEME ADDON START ==============
const ThemeContext = createContext();

const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

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

const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
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

// Configuration
const SOCKET_SERVER_URL = "http://localhost:5000";

// Styled Components
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Authentication state
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?.id;
  const token = localStorage.getItem("token");

  // Component state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Socket integration using custom hook
  const socket = useChatSocket(SOCKET_SERVER_URL, token, loggedInUserId, selectedUser);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Setup socket event handlers
  useEffect(() => {
    if (!loggedInUserId) return;

    socket.setupChatHandlers({
      setMessages,
      setUsers,
      setSelectedUser,
      setTypingUsers
    });
  }, [loggedInUserId, selectedUser, socket]);

  // Handle user selection
  const handleSelectUser = (userId) => {
    const freshUser = users.find(u => u._id === userId);
    if (freshUser) {
      setSelectedUser(freshUser);
      if (isMobile) setMobileOpen(false);
    }
  };

  // Fetch users
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
      } catch (error) {
        setErrorUsers("Failed to load users");
        console.error(error);
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, [token]);

  // Fetch messages when user is selected
  useEffect(() => {
    if (!selectedUser || !loggedInUserId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/${loggedInUserId}/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setMessages(
          data?.map(msg => ({
            ...msg,
            delivered: msg.delivered ?? false,
            read: msg.read ?? false,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser, loggedInUserId, token]);

  // Mark messages as read
  useEffect(() => {
    if (!selectedUser) return;

    messages.forEach((msg) => {
      if (!msg.read && msg.from._id === selectedUser._id) {
        socket.markRead(msg._id);
      }
    });
  }, [selectedUser, messages, socket]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset search when users or selected user changes
  useEffect(() => {
    setFilteredUsers(null);
    setSearchQuery("");
  }, [users, selectedUser]);

  // Handle search
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

  // Send message
  const handleSend = () => {
    if (!text.trim() || !selectedUser) return;

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
    socket.sendMessage(message);
    setText("");
  };

  // Handle typing
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!selectedUser) return;

    // Emit typing status
    socket.setTyping(selectedUser._id, value.length > 0);

    // Clear old timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Auto-stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.setTyping(selectedUser._id, false);
    }, 2000);
  };

  // Message actions
  const handleDeleteForEveryone = (msg) => {
    socket.deleteMessage(msg._id);
    setMessages(prev => prev.filter(m => m._id !== msg._id));
    handleMenuClose();
  };

  const handleDeleteForMe = (msg) => {
    socket.deleteMessageForMe(msg._id, loggedInUserId);
    setMessages(prev => prev.filter(m => m._id !== msg._id));
    handleMenuClose();
  };

  // Menu handlers
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Utility functions
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

  const getLastSeenText = (lastSeen) => {
    if (!lastSeen) return '';
    const date = new Date(lastSeen);

    if (isToday(date)) return `Today at ${format(date, 'hh:mm a')}`;
    if (isYesterday(date)) return `Yesterday at ${format(date, 'hh:mm a')}`;
    
    return format(date, 'dd/MM/yyyy hh:mm a');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const usersToShow = filteredUsers !== null ? filteredUsers : users;
  const open = Boolean(anchorEl);

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
                onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
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
      {/* Mobile Drawer */}
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

      {/* Desktop Sidebar */}
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
                          src={selectedUser.avatar || avatar1}
                          sx={{ bgcolor: selectedUser.avatar ? 'transparent' : 'primary.contrastText' }}
                        >
                          {!selectedUser.avatar && getInitials(selectedUser.name)}
                        </Avatar>
                      </OnlineBadge>
                    ) : (
                      <Avatar
                        src={selectedUser.avatar || avatar1}
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

            {/* Messages Container */}
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

                            {/* Message Menu */}
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', top: 0, right: -28 }}
                              onClick={(e) => handleMenuClick(e, msg)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>

                            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                              <MenuItem onClick={() => handleDeleteForEveryone(msg)}>
                                <DeleteOutlined sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                Delete for Everyone
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteForMe(msg)}>
                                <DeleteOutlined sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                Delete for Me
                              </MenuItem>
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



// import React, { useState, useEffect, useRef, createContext, useContext } from "react";
// import { format, isToday, isYesterday } from 'date-fns';
// import {
//   Box,
//   Grid,
//   Typography,
//   Avatar,
//   TextField,
//   IconButton,
//   Paper,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   InputAdornment,
//   Badge,
//   Chip,
//   Stack,
//   CircularProgress,
//   Divider,
//   AppBar,
//   Toolbar,
//   Fab,
//   MenuItem,
//   Tooltip,
//   Card,
//   CardContent,
//   useTheme,
//   useMediaQuery,
//   Drawer,
//   alpha,
//   Menu,
//   ThemeProvider,
//   createTheme,
//   CssBaseline,
//   Skeleton,
//   Slide,
//   Fade,
//   Button,
// } from "@mui/material";
// import {
//   Search as SearchIcon,
//   Send as SendIcon,
//   MoreVert as MoreVertIcon,
//   Phone as PhoneIcon,
//   Videocam as VideocamIcon,
//   AttachFile as AttachFileIcon,
//   EmojiEmotions as EmojiEmotionsIcon,
//   Mic as MicIcon,
//   ArrowBack as ArrowBackIcon,
//   Chat as ChatIcon,
//   Group as GroupIcon,
//   Settings as SettingsIcon,
//   Done as DoneIcon,
//   DoneAll as DoneAllIcon,
//   PersonAdd as PersonAddIcon,
//   DeleteOutlined,
//   DarkMode as DarkModeIcon,
//   LightMode as LightModeIcon,
//   PhotoCamera as PhotoCameraIcon,
//   InsertDriveFile as InsertDriveFileIcon,
//   LocationOn as LocationOnIcon,
//   ContactPhone as ContactPhoneIcon,
//   Star as StarIcon,
//   Block as BlockIcon,
//   VolumeOff as VolumeOffIcon,
//   Wallpaper as WallpaperIcon,
//   CameraAlt as CameraAltIcon,
//   KeyboardVoice as KeyboardVoiceIcon,
// } from "@mui/icons-material";
// import { styled, keyframes } from "@mui/material/styles";

// // ============== THEME ENHANCEMENT START ==============
// const ThemeContext = createContext();

// const useThemeMode = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useThemeMode must be used within a ThemeProvider');
//   }
//   return context;
// };

// const getTheme = (mode) => {
//   const isLight = mode === 'light';
  
//   return createTheme({
//     palette: {
//       mode,
//       primary: {
//         main: isLight ? '#25d366' : '#00a884',
//         light: isLight ? '#4ddd7a' : '#26d367',
//         dark: isLight ? '#128c7e' : '#008069',
//         contrastText: '#ffffff',
//       },
//       secondary: {
//         main: isLight ? '#34b7f1' : '#53bdeb',
//       },
//       background: {
//         default: isLight ? '#f0f2f5' : '#111b21',
//         paper: isLight ? '#ffffff' : '#202c33',
//         chat: isLight ? '#efeae2' : '#0b141a',
//         sidebar: isLight ? '#f0f2f5' : '#111b21',
//         header: isLight ? '#f0f2f5' : '#202c33',
//       },
//       text: {
//         primary: isLight ? '#111b21' : '#e9edef',
//         secondary: isLight ? '#667781' : '#8696a0',
//         hint: isLight ? '#8696a0' : '#667781',
//       },
//       divider: isLight ? '#e9edef' : '#2a3942',
//       chat: {
//         myBubble: isLight ? '#d9fdd3' : '#005c4b',
//         otherBubble: isLight ? '#ffffff' : '#202c33',
//         myBubbleText: isLight ? '#111b21' : '#ffffff',
//         otherBubbleText: isLight ? '#111b21' : '#e9edef',
//         timestamp: isLight ? '#667781' : '#8696a0',
//       },
//       status: {
//         online: '#25d366',
//         typing: '#25d366',
//         away: '#ffb74d',
//         offline: '#8696a0',
//       }
//     },
//     typography: {
//       fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
//       h6: {
//         fontWeight: 500,
//         fontSize: '1rem',
//       },
//       body1: {
//         fontSize: '0.875rem',
//       },
//       body2: {
//         fontSize: '0.8125rem',
//       },
//       caption: {
//         fontSize: '0.75rem',
//       },
//     },
//     components: {
//       MuiCssBaseline: {
//         styleOverrides: {
//           body: {
//             scrollbarWidth: 'thin',
//             scrollbarColor: isLight ? '#c1c1c1 #f1f1f1' : '#3a3a3a #1a1a1a',
//             '&::-webkit-scrollbar': {
//               width: '6px',
//             },
//             '&::-webkit-scrollbar-track': {
//               background: isLight ? '#f1f1f1' : '#1a1a1a',
//             },
//             '&::-webkit-scrollbar-thumb': {
//               background: isLight ? '#c1c1c1' : '#3a3a3a',
//               borderRadius: '3px',
//             },
//             '&::-webkit-scrollbar-thumb:hover': {
//               background: isLight ? '#a8a8a8' : '#4a4a4a',
//             },
//           },
//         },
//       },
//       MuiPaper: {
//         styleOverrides: {
//           root: {
//             backgroundImage: 'none',
//           },
//         },
//       },
//     },
//   });
// };

// const CustomThemeProvider = ({ children }) => {
//   const [mode, setMode] = useState(() => {
//     // Don't use localStorage in artifacts
//     return 'light';
//   });

//   const toggleTheme = () => {
//     const newMode = mode === 'light' ? 'dark' : 'light';
//     setMode(newMode);
//   };

//   const theme = getTheme(mode);

//   return (
//     <ThemeContext.Provider value={{ mode, toggleTheme }}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </ThemeContext.Provider>
//   );
// };

// const ThemeToggle = () => {
//   const { mode, toggleTheme } = useThemeMode();
  
//   return (
//     <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
//       <IconButton 
//         sx={{ 
//           color: 'text.secondary',
//           '&:hover': { backgroundColor: alpha('#ffffff', 0.1) }
//         }} 
//         onClick={toggleTheme}
//       >
//         {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
//       </IconButton>
//     </Tooltip>
//   );
// };
// // ============== THEME ENHANCEMENT END ==============

// // ============== ANIMATIONS ==============
// const typingAnimation = keyframes`
//   0%, 60%, 100% { transform: translateY(0); }
//   30% { transform: translateY(-10px); }
// `;

// const fadeIn = keyframes`
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// `;

// const slideIn = keyframes`
//   from { opacity: 0; transform: translateX(-20px); }
//   to { opacity: 1; transform: translateX(0); }
// `;

// // ============== STYLED COMPONENTS ==============
// const StyledPaper = styled(Paper)(({ theme }) => ({
//   height: "100vh",
//   display: "flex",
//   flexDirection: "column",
//   borderRadius: 0,
//   boxShadow: "none",
//   backgroundColor: theme.palette.background.paper,
// }));

// const ChatListContainer = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.background.sidebar,
//   height: "100%",
//   display: "flex",
//   flexDirection: "column",
//   borderRight: `1px solid ${theme.palette.divider}`,
// }));

// const ChatHeader = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.background.header,
//   color: theme.palette.text.primary,
//   padding: theme.spacing(1, 2),
//   borderBottom: `1px solid ${theme.palette.divider}`,
// }));

// const SearchContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(0.75, 1.5),
//   backgroundColor: theme.palette.background.sidebar,
// }));

// const StyledTextField = styled(TextField)(({ theme }) => ({
//   "& .MuiOutlinedInput-root": {
//     backgroundColor: theme.palette.background.paper,
//     borderRadius: theme.spacing(1),
//     fontSize: '0.875rem',
//     "& fieldset": {
//       borderColor: theme.palette.divider,
//     },
//     "&:hover fieldset": {
//       borderColor: theme.palette.text.secondary,
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: theme.palette.primary.main,
//       borderWidth: '1px',
//     },
//   },
// }));

// const ChatListItem = styled(ListItem)(({ theme, selected }) => ({
//   cursor: "pointer",
//   backgroundColor: selected ? alpha(theme.palette.text.primary, 0.05) : "transparent",
//   padding: theme.spacing(1.5, 2),
//   "&:hover": {
//     backgroundColor: selected ? alpha(theme.palette.text.primary, 0.05) : alpha(theme.palette.text.primary, 0.02),
//   },
//   transition: theme.transitions.create(['background-color'], {
//     duration: theme.transitions.duration.short,
//   }),
// }));

// const MessagesContainer = styled(Box)(({ theme }) => ({
//   flex: 1,
//   overflowY: "auto",
//   backgroundColor: theme.palette.background.chat,
//   backgroundImage: theme.palette.mode === 'light' 
//     ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//     : 'none',
//   padding: theme.spacing(1),
//   display: "flex",
//   flexDirection: "column",
// }));

// const MessageBubble = styled(Paper)(({ theme, isMe }) => ({
//   padding: theme.spacing(1, 1.5, 0.5, 1.5),
//   maxWidth: "75%",
//   backgroundColor: isMe ? 
//     theme.palette.chat.myBubble : 
//     theme.palette.chat.otherBubble,
//   color: isMe ? 
//     theme.palette.chat.myBubbleText : 
//     theme.palette.chat.otherBubbleText,
//   borderRadius: theme.spacing(1),
//   borderBottomLeftRadius: isMe ? theme.spacing(1) : theme.spacing(0.25),
//   borderBottomRightRadius: isMe ? theme.spacing(0.25) : theme.spacing(1),
//   marginBottom: theme.spacing(0.25),
//   boxShadow: theme.shadows[1],
//   position: 'relative',
//   animation: `${fadeIn} 0.2s ease-out`,
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     bottom: -2,
//     [isMe ? 'right' : 'left']: -6,
//     width: 0,
//     height: 0,
//     borderLeft: isMe ? 'none' : `6px solid ${theme.palette.chat.otherBubble}`,
//     borderRight: isMe ? `6px solid ${theme.palette.chat.myBubble}` : 'none',
//     borderTop: `6px solid transparent`,
//     borderBottom: `2px solid transparent`,
//   }
// }));

// const MessageInput = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "flex-end",
//   padding: theme.spacing(1, 1.5),
//   backgroundColor: theme.palette.background.header,
//   gap: theme.spacing(1),
//   borderTop: `1px solid ${theme.palette.divider}`,
// }));

// const StyledMessageInput = styled(TextField)(({ theme }) => ({
//   "& .MuiOutlinedInput-root": {
//     backgroundColor: theme.palette.background.paper,
//     borderRadius: theme.spacing(3),
//     fontSize: '0.875rem',
//     "& fieldset": {
//       borderColor: theme.palette.divider,
//     },
//     "&:hover fieldset": {
//       borderColor: theme.palette.text.secondary,
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: theme.palette.primary.main,
//       borderWidth: '1px',
//     },
//   },
// }));

// const OnlineBadge = styled(Badge)(({ theme }) => ({
//   "& .MuiBadge-badge": {
//     backgroundColor: theme.palette.status.online,
//     color: theme.palette.status.online,
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//     width: 12,
//     height: 12,
//     borderRadius: '50%',
//     "&::after": {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       borderRadius: "50%",
//       animation: "ripple 1.2s infinite ease-in-out",
//       border: `1px solid ${theme.palette.status.online}`,
//       content: '""',
//     },
//   },
//   "@keyframes ripple": {
//     "0%": {
//       transform: "scale(.8)",
//       opacity: 1,
//     },
//     "100%": {
//       transform: "scale(2.4)",
//       opacity: 0,
//     },
//   },
// }));

// const TypingIndicator = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: theme.spacing(0.5),
//   padding: theme.spacing(1, 1.5),
//   backgroundColor: theme.palette.chat.otherBubble,
//   borderRadius: theme.spacing(2),
//   maxWidth: '60px',
//   marginBottom: theme.spacing(1),
//   '& .dot': {
//     width: 8,
//     height: 8,
//     backgroundColor: theme.palette.text.secondary,
//     borderRadius: '50%',
//     animation: `${typingAnimation} 1.4s infinite ease-in-out`,
//     '&:nth-of-type(1)': { animationDelay: '-0.32s' },
//     '&:nth-of-type(2)': { animationDelay: '-0.16s' },
//   }
// }));

// const AttachmentMenu = styled(Menu)(({ theme }) => ({
//   '& .MuiPaper-root': {
//     backgroundColor: theme.palette.background.paper,
//     borderRadius: theme.spacing(1),
//     minWidth: 200,
//   }
// }));

// // ============== MOCK DATA ==============
// const mockUsers = [
//   {
//     _id: '1',
//     name: 'Alice Johnson',
//     email: 'alice@example.com',
//     online: true,
//     lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
//     lastMessage: 'Hey! How are you doing?',
//     unreadCount: 2,
//     avatar: null,
//   },
//   {
//     _id: '2',
//     name: 'Bob Smith',
//     email: 'bob@example.com',
//     online: false,
//     lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
//     lastMessage: 'See you tomorrow!',
//     unreadCount: 0,
//     avatar: null,
//   },
//   {
//     _id: '3',
//     name: 'Carol Williams',
//     email: 'carol@example.com',
//     online: true,
//     lastSeen: new Date().toISOString(),
//     lastMessage: 'Thanks for the help 😊',
//     unreadCount: 1,
//     avatar: null,
//   },
//   {
//     _id: '4',
//     name: 'David Brown',
//     email: 'david@example.com',
//     online: false,
//     lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
//     lastMessage: 'Let me check and get back to you',
//     unreadCount: 0,
//     avatar: null,
//   },
// ];

// const mockMessages = [
//   {
//     _id: '1',
//     from: { _id: '1', name: 'Alice Johnson' },
//     to: 'current-user',
//     content: 'Hey! How are you doing?',
//     createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
//     delivered: true,
//     read: false,
//   },
//   {
//     _id: '2',
//     from: 'current-user',
//     to: '1',
//     content: 'I\'m doing great! Just working on some projects. How about you?',
//     createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
//     delivered: true,
//     read: true,
//   },
//   {
//     _id: '3',
//     from: { _id: '1', name: 'Alice Johnson' },
//     to: 'current-user',
//     content: 'Same here! Been quite busy lately. Are we still on for coffee tomorrow?',
//     createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
//     delivered: true,
//     read: false,
//   },
//   {
//     _id: '4',
//     from: 'current-user',
//     to: '1',
//     content: 'Absolutely! Looking forward to it 😊',
//     createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
//     delivered: true,
//     read: true,
//   },
// ];

// // ============== MAIN COMPONENT ==============
// function WhatsAppChatInner() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   // Mock authentication
//   const loggedInUser = { id: 'current-user', name: 'You', email: 'you@example.com' };
//   const loggedInUserId = loggedInUser.id;

//   // Component state
//   const [users, setUsers] = useState(mockUsers);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
//   const [messages, setMessages] = useState(mockMessages);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [typingUsers, setTypingUsers] = useState(new Set());
//   const [text, setText] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [attachmentAnchor, setAttachmentAnchor] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);

//   const messagesEndRef = useRef(null);

//   // Handle user selection
//   const handleSelectUser = (userId) => {
//     const user = users.find(u => u._id === userId);
//     if (user) {
//       setSelectedUser(user);
//       if (isMobile) setMobileOpen(false);
//     }
//   };

//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle search
//   const handleSearch = () => {
//     if (!searchQuery.trim()) {
//       setFilteredUsers(null);
//       return;
//     }
//     const query = searchQuery.trim().toLowerCase();
//     const filtered = users.filter(
//       (user) =>
//         user.name?.toLowerCase().includes(query) ||
//         user.email?.toLowerCase().includes(query)
//     );
//     setFilteredUsers(filtered);
//   };

//   // Send message
//   const handleSend = () => {
//     if (!text.trim() || !selectedUser) return;

//     const newMessage = {
//       _id: Date.now().toString(),
//       from: loggedInUserId,
//       to: selectedUser._id,
//       content: text.trim(),
//       createdAt: new Date().toISOString(),
//       delivered: true,
//       read: false,
//     };

//     setMessages(prev => [...prev, newMessage]);
//     setText("");

//     // Update last message in user list
//     setUsers(prev => prev.map(user => 
//       user._id === selectedUser._id 
//         ? { ...user, lastMessage: newMessage.content }
//         : user
//     ));
//   };

//   // Handle text change
//   const handleTextChange = (e) => {
//     const value = e.target.value;
//     setText(value);

//     // Simulate typing indicator
//     if (value.length > 0 && !typingUsers.has('demo-typing')) {
//       setTypingUsers(prev => new Set([...prev, 'demo-typing']));
//       setTimeout(() => {
//         setTypingUsers(prev => {
//           const newSet = new Set(prev);
//           newSet.delete('demo-typing');
//           return newSet;
//         });
//       }, 3000);
//     }
//   };

//   // Menu handlers
//   const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);
//   const handleAttachmentClick = (event) => setAttachmentAnchor(event.currentTarget);
//   const handleAttachmentClose = () => setAttachmentAnchor(null);

//   // Utility functions
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const getInitials = (name) => {
//     return (
//       name
//         ?.split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase() || "?"
//     );
//   };

//   const getLastSeenText = (lastSeen) => {
//     if (!lastSeen) return '';
//     const date = new Date(lastSeen);

//     if (isToday(date)) return `today at ${format(date, 'HH:mm')}`;
//     if (isYesterday(date)) return `yesterday at ${format(date, 'HH:mm')}`;
    
//     return format(date, 'dd/MM/yyyy');
//   };

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const usersToShow = filteredUsers !== null ? filteredUsers : users;
//   const open = Boolean(anchorEl);
//   const attachmentOpen = Boolean(attachmentAnchor);

//   const drawer = (
//     <ChatListContainer>
//       {/* Header */}
//       <ChatHeader>
//         <Box display="flex" alignItems="center" justifyContent="space-between" py={1}>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Avatar
//               sx={{
//                 bgcolor: 'primary.main',
//                 color: 'primary.contrastText',
//                 width: 40,
//                 height: 40,
//               }}
//             >
//               <ChatIcon />
//             </Avatar>
//             <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
//               VibeTalk
//             </Typography>
//           </Box>
//           <Stack direction="row" spacing={0.5}>
//             <ThemeToggle />
//             <Tooltip title="New Group">
//               <IconButton size="small" sx={{ color: 'text.secondary' }}>
//                 <GroupIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Menu">
//               <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={handleMenuClick}>
//                 <MoreVertIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Stack>
//         </Box>
//       </ChatHeader>

//       {/* Search */}
//       <SearchContainer>
//         <StyledTextField
//           fullWidth
//           size="small"
//           placeholder="Search or start new chat"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </SearchContainer>

//       {/* Loading State */}
//       {loadingUsers && (
//         <Box sx={{ p: 2 }}>
//           {[...Array(5)].map((_, i) => (
//             <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <Skeleton variant="circular" width={48} height={48} />
//               <Box sx={{ ml: 2, flex: 1 }}>
//                 <Skeleton variant="text" width="60%" />
//                 <Skeleton variant="text" width="40%" />
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       )}

//       {/* Chat List */}
//       <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
//         {usersToShow.map((user, index) => (
//           <React.Fragment key={user._id}>
//             <ChatListItem
//               selected={selectedUser?._id === user._id}
//               onClick={() => handleSelectUser(user._id)}
//             >
//               <ListItemAvatar>
//                 {user.online ? (
//                   <OnlineBadge
//                     overlap="circular"
//                     anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                     variant="dot"
//                   >
//                     <Avatar
//                       src={user.avatar}
//                       sx={{
//                         bgcolor: user.avatar ? 'transparent' : 'primary.main',
//                         width: 48,
//                         height: 48,
//                         color: 'primary.contrastText',
//                       }}
//                     >
//                       {!user.avatar && getInitials(user.name)}
//                     </Avatar>
//                   </OnlineBadge>
//                 ) : (
//                   <Avatar
//                     src={user.avatar}
//                     sx={{
//                       bgcolor: user.avatar ? 'transparent' : 'grey.400',
//                       width: 48,
//                       height: 48,
//                       color: 'white',
//                     }}
//                   >
//                     {!user.avatar && getInitials(user.name)}
//                   </Avatar>
//                 )}
//               </ListItemAvatar>

//               <ListItemText
//                 primary={
//                   <Box display="flex" justifyContent="space-between" alignItems="center">
//                     <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary' }}>
//                       {user.name}
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: 'text.hint' }}>
//                       {user.online ? '' : getLastSeenText(user.lastSeen)}
//                     </Typography>
//                   </Box>
//                 }
//                 secondary={
//                   <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         color: 'text.secondary',
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                         flex: 1,
//                         mr: 1,
//                       }}
//                     >
//                       {user.lastMessage || "No messages yet"}
//                     </Typography>
//                     {user.unreadCount > 0 && (
//                       <Chip
//                         label={user.unreadCount}
//                         size="small"
//                         sx={{
//                           bgcolor: 'primary.main',
//                           color: 'primary.contrastText',
//                           height: 20,
//                           fontSize: '0.75rem',
//                           fontWeight: 500,
//                           minWidth: 20,
//                         }}
//                       />
//                     )}
//                   </Box>
//                 }
//               />
//             </ChatListItem>
//             {index < usersToShow.length - 1 && <Divider variant="inset" component="li" />}
//           </React.Fragment>
//         ))}
//       </List>

//       {/* Menu */}
//       <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//         <MenuItem onClick={handleMenuClose}>
//           <PersonAddIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
//           New Contact
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <GroupIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
//           New Group
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <StarIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
//           Starred Messages
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <SettingsIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
//           Settings
//         </MenuItem>
//       </Menu>
//     </ChatListContainer>
//   );

//   return (
//     <Box sx={{ display: 'flex', height: '100vh' }}>
//       {/* Mobile Drawer */}
//       {isMobile && (
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 320 },
//           }}
//         >
//           {drawer}
//         </Drawer>
//       )}

//       {/* Desktop Sidebar */}
//       {!isMobile && (
//         <Box sx={{ width: 380, flexShrink: 0 }}>
//           {drawer}
//         </Box>
//       )}

//       {/* Chat Area */}
//       <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         {selectedUser ? (
//           <StyledPaper>
//             {/* Chat Header */}
//             <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.header', color: 'text.primary' }}>
//               <Toolbar sx={{ minHeight: '60px !important', px: 2 }}>
//                 <Box display="flex" alignItems="center" flexGrow={1}>
//                   {isMobile && (
//                     <IconButton
//                       edge="start"
//                       sx={{ color: 'text.primary', mr: 1 }}
//                       onClick={handleDrawerToggle}
//                     >
//                       <ArrowBackIcon />
//                     </IconButton>
//                   )}

//                   <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
//                     {selectedUser.online ? (
//                       <OnlineBadge
//                         overlap="circular"
//                         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                         variant="dot"
//                       >
//                         <Avatar
//                           src={selectedUser.avatar}
//                           sx={{ 
//                             bgcolor: selectedUser.avatar ? 'transparent' : 'primary.main',
//                             width: 40,
//                             height: 40,
//                             color: 'primary.contrastText'
//                           }}
//                         >
//                           {!selectedUser.avatar && getInitials(selectedUser.name)}
//                         </Avatar>
//                       </OnlineBadge>
//                     ) : (
//                       <Avatar
//                         src={selectedUser.avatar}
//                         sx={{ 
//                           bgcolor: selectedUser.avatar ? 'transparent' : 'grey.400',
//                           width: 40,
//                           height: 40,
//                           color: 'white'
//                         }}
//                       >
//                         {!selectedUser.avatar && getInitials(selectedUser.name)}
//                       </Avatar>
//                     )}

//                     <Box>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
//                         {selectedUser.name}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                         {typingUsers.size > 0 ? (
//                           <span style={{ color: theme.palette.status.typing }}>typing...</span>
//                         ) : selectedUser.online ? (
//                           "online"
//                         ) : selectedUser.lastSeen ? (
//                           `last seen ${getLastSeenText(selectedUser.lastSeen)}`
//                         ) : (
//                           "offline"
//                         )}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>

//                 <Stack direction="row" spacing={0.5}>
//                   <Tooltip title="Video Call">
//                     <IconButton sx={{ color: 'text.secondary' }}>
//                       <VideocamIcon fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Voice Call">
//                     <IconButton sx={{ color: 'text.secondary' }}>
//                       <PhoneIcon fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="More">
//                     <IconButton sx={{ color: 'text.secondary' }} onClick={handleMenuClick}>
//                       <MoreVertIcon fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                 </Stack>
//               </Toolbar>
//             </AppBar>

//             {/* Messages Container */}
//             <MessagesContainer>
//               {loadingMessages && (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
//                   <CircularProgress size={24} sx={{ color: 'primary.main' }} />
//                   <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
//                     Loading messages...
//                   </Typography>
//                 </Box>
//               )}

//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}>
//                 {messages.reduce((acc, msg, index) => {
//                   const isMe = String(msg.from?._id || msg.from) === String(loggedInUserId);
//                   const currentMsgDate = new Date(msg.createdAt).toDateString();
//                   const prevMsgDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;

//                   // Add date separator if new day
//                   if (currentMsgDate !== prevMsgDate) {
//                     acc.push(
//                       <Box key={`date-${msg._id}`} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
//                         <Typography 
//                           variant="caption" 
//                           sx={{ 
//                             bgcolor: alpha(theme.palette.text.primary, 0.05),
//                             color: 'text.secondary',
//                             px: 2, 
//                             py: 0.5, 
//                             borderRadius: 2,
//                             fontSize: '0.75rem'
//                           }}
//                         >
//                           {isToday(new Date(currentMsgDate)) ? 'TODAY' : 
//                            isYesterday(new Date(currentMsgDate)) ? 'YESTERDAY' : 
//                            format(new Date(currentMsgDate), 'dd/MM/yyyy')}
//                         </Typography>
//                       </Box>
//                     );
//                   }

//                   // Push the message bubble
//                   acc.push(
//                     <Box
//                       key={msg._id}
//                       sx={{
//                         display: 'flex',
//                         justifyContent: isMe ? 'flex-end' : 'flex-start',
//                         mb: 0.5,
//                       }}
//                     >
//                       <MessageBubble isMe={isMe} elevation={0}>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             whiteSpace: 'pre-wrap',
//                             wordBreak: 'break-word',
//                             mb: 0.5,
//                             lineHeight: 1.4,
//                           }}
//                         >
//                           {msg.content}
//                         </Typography>

//                         <Box
//                           sx={{
//                             display: 'flex',
//                             justifyContent: 'flex-end',
//                             alignItems: 'center',
//                             gap: 0.5,
//                             mt: 0.5,
//                           }}
//                         >
//                           <Typography 
//                             variant="caption" 
//                             sx={{ 
//                               color: isMe ? alpha(theme.palette.chat.myBubbleText, 0.7) : 'text.hint',
//                               fontSize: '0.6875rem'
//                             }}
//                           >
//                             {formatTime(msg.createdAt)}
//                           </Typography>

//                           {isMe && (
//                             <>
//                               {msg.read ? (
//                                 <DoneAllIcon sx={{ 
//                                   fontSize: 16, 
//                                   color: theme.palette.status.online,
//                                   opacity: 0.8 
//                                 }} />
//                               ) : msg.delivered ? (
//                                 <DoneAllIcon sx={{ 
//                                   fontSize: 16, 
//                                   color: alpha(theme.palette.chat.myBubbleText, 0.6)
//                                 }} />
//                               ) : (
//                                 <DoneIcon sx={{ 
//                                   fontSize: 16, 
//                                   color: alpha(theme.palette.chat.myBubbleText, 0.6)
//                                 }} />
//                               )}
//                             </>
//                           )}
//                         </Box>
//                       </MessageBubble>
//                     </Box>
//                   );

//                   return acc;
//                 }, [])}

//                 {/* Typing Indicator */}
//                 {typingUsers.size > 0 && (
//                   <Fade in timeout={200}>
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
//                       <TypingIndicator>
//                         <div className="dot" />
//                         <div className="dot" />
//                         <div className="dot" />
//                       </TypingIndicator>
//                     </Box>
//                   </Fade>
//                 )}

//                 <div ref={messagesEndRef} />
//               </Box>
//             </MessagesContainer>

//             {/* Message Input */}
//             <MessageInput>
//               <Tooltip title="Attach">
//                 <IconButton 
//                   sx={{ color: 'text.secondary' }}
//                   onClick={handleAttachmentClick}
//                 >
//                   <AttachFileIcon fontSize="small" />
//                 </IconButton>
//               </Tooltip>

//               <Box sx={{ flex: 1, position: 'relative' }}>
//                 <StyledMessageInput
//                   fullWidth
//                   placeholder="Type a message"
//                   value={text}
//                   onChange={handleTextChange}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSend();
//                     }
//                   }}
//                   multiline
//                   maxRows={4}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           size="small"
//                           onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                           sx={{ color: 'text.secondary' }}
//                         >
//                           <EmojiEmotionsIcon fontSize="small" />
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Box>

//               {text.trim() ? (
//                 <Tooltip title="Send">
//                   <Fab
//                     color="primary"
//                     size="small"
//                     onClick={handleSend}
//                     sx={{ 
//                       width: 48, 
//                       height: 48,
//                       boxShadow: theme.shadows[2]
//                     }}
//                   >
//                     <SendIcon fontSize="small" />
//                   </Fab>
//                 </Tooltip>
//               ) : (
//                 <Tooltip title="Voice message">
//                   <IconButton 
//                     sx={{ 
//                       color: isRecording ? 'error.main' : 'text.secondary',
//                       bgcolor: isRecording ? alpha(theme.palette.error.main, 0.1) : 'transparent',
//                       '&:hover': {
//                         bgcolor: isRecording ? alpha(theme.palette.error.main, 0.2) : alpha(theme.palette.action.hover, 0.04)
//                       }
//                     }}
//                     onClick={() => setIsRecording(!isRecording)}
//                   >
//                     {isRecording ? <KeyboardVoiceIcon /> : <MicIcon />}
//                   </IconButton>
//                 </Tooltip>
//               )}
//             </MessageInput>

//             {/* Attachment Menu */}
//             <AttachmentMenu
//               anchorEl={attachmentAnchor}
//               open={attachmentOpen}
//               onClose={handleAttachmentClose}
//               anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//               transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             >
//               <MenuItem onClick={handleAttachmentClose}>
//                 <PhotoCameraIcon sx={{ mr: 2, color: 'primary.main' }} />
//                 Camera
//               </MenuItem>
//               <MenuItem onClick={handleAttachmentClose}>
//                 <InsertDriveFileIcon sx={{ mr: 2, color: 'secondary.main' }} />
//                 Document
//               </MenuItem>
//               <MenuItem onClick={handleAttachmentClose}>
//                 <CameraAltIcon sx={{ mr: 2, color: 'success.main' }} />
//                 Gallery
//               </MenuItem>
//               <MenuItem onClick={handleAttachmentClose}>
//                 <ContactPhoneIcon sx={{ mr: 2, color: 'warning.main' }} />
//                 Contact
//               </MenuItem>
//               <MenuItem onClick={handleAttachmentClose}>
//                 <LocationOnIcon sx={{ mr: 2, color: 'error.main' }} />
//                 Location
//               </MenuItem>
//             </AttachmentMenu>

//             {/* Chat Menu */}
//             <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//               <MenuItem onClick={handleMenuClose}>
//                 <ContactPhoneIcon sx={{ mr: 2, fontSize: '1.25rem' }} />
//                 Contact info
//               </MenuItem>
//               <MenuItem onClick={handleMenuClose}>
//                 <WallpaperIcon sx={{ mr: 2, fontSize: '1.25rem' }} />
//                 Wallpaper
//               </MenuItem>
//               <MenuItem onClick={handleMenuClose}>
//                 <StarIcon sx={{ mr: 2, fontSize: '1.25rem' }} />
//                 Starred messages
//               </MenuItem>
//               <MenuItem onClick={handleMenuClose}>
//                 <VolumeOffIcon sx={{ mr: 2, fontSize: '1.25rem' }} />
//                 Mute notifications
//               </MenuItem>
//               <MenuItem onClick={handleMenuClose}>
//                 <BlockIcon sx={{ mr: 2, fontSize: '1.25rem', color: 'error.main' }} />
//                 Block
//               </MenuItem>
//             </Menu>
//           </StyledPaper>
//         ) : (
//           <Box
//             sx={{
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               bgcolor: 'background.chat',
//               textAlign: 'center',
//               p: 4,
//             }}
//           >
//             <Box
//               sx={{
//                 width: 200,
//                 height: 200,
//                 bgcolor: 'background.paper',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 mb: 4,
//                 boxShadow: theme.shadows[3],
//               }}
//             >
//               <ChatIcon sx={{ fontSize: 80, color: 'primary.main' }} />
//             </Box>
//             <Typography variant="h4" sx={{ fontWeight: 300, mb: 2, color: 'text.primary' }}>
//               WhatsApp Web
//             </Typography>
//             <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 440 }}>
//               {loggedInUser ?
//                 `Keep your phone connected to use WhatsApp on your computer. Select a chat to start messaging.` :
//                 'Please log in to start using WhatsApp Web.'
//               }
//             </Typography>
//             {isMobile && (
//               <Button
//                 variant="contained"
//                 onClick={handleDrawerToggle}
//                 sx={{ mt: 2 }}
//                 startIcon={<ChatIcon />}
//               >
//                 Open Chats
//               </Button>
//             )}
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// export default function WhatsAppChat() {
//   return (
//     <CustomThemeProvider>
//       <WhatsAppChatInner />
//     </CustomThemeProvider>
//   );
// }