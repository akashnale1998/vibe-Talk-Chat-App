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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  AvatarGroup,
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
  Add as AddIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Camera as CameraIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Reply as ReplyIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
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

// Status Components
const StatusRing = styled(Box)(({ theme, hasStatus, isViewed }) => ({
  position: 'relative',
  borderRadius: '50%',
  padding: hasStatus ? '3px' : '0px',
  background: hasStatus ? (isViewed ? 
    `linear-gradient(45deg, ${alpha(theme.palette.text.secondary, 0.5)} 0%, ${alpha(theme.palette.text.secondary, 0.3)} 100%)` :
    `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
  ) : 'transparent',
}));

const StatusDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.default,
    maxWidth: '90vw',
    maxHeight: '90vh',
    width: '100%',
    height: '100%',
    margin: 0,
    borderRadius: 0,
  },
}));

const StatusViewer = ({ open, onClose, status, currentIndex, onNext, onPrevious }) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!open || !isPlaying) return;

    setProgress(0);
    const duration = 5000; // 5 seconds per status
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(intervalRef.current);
  }, [open, isPlaying, currentIndex, onNext]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReply = () => {
    // Handle reply to status
    console.log('Reply to status');
  };

  if (!status || !open) return null;

  return (
    <StatusDialog open={open} onClose={onClose}>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', bgcolor: 'black' }}>
        {/* Header */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
          p: 2,
        }}>
          {/* Progress bars */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
            {status.stories?.map((_, index) => (
              <LinearProgress
                key={index}
                variant="determinate"
                value={index === currentIndex ? progress : index < currentIndex ? 100 : 0}
                sx={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  bgcolor: alpha('#fff', 0.3),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#fff'
                  }
                }}
              />
            ))}
          </Box>

          {/* User info */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={status.avatar || avatar1} sx={{ width: 32, height: 32 }}>
                {status.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                  {status.name}
                </Typography>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                  {format(new Date(status.stories?.[currentIndex]?.timestamp || Date.now()), 'h:mm a')}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton onClick={togglePlayPause} sx={{ color: 'white' }}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton onClick={onClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Status content */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={onNext}
        >
          {status.stories?.[currentIndex]?.type === 'image' ? (
            <img
              src={status.stories[currentIndex].content}
              alt="Status"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: status.stories?.[currentIndex]?.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              p: 4,
            }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 500,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {status.stories?.[currentIndex]?.content}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <IconButton onClick={() => setLiked(!liked)} sx={{ color: liked ? '#ff4444' : 'white' }}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <TextField
            placeholder="Reply..."
            variant="outlined"
            size="small"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: alpha('#fff', 0.1),
                color: 'white',
                '& fieldset': { borderColor: alpha('#fff', 0.3) },
                '&:hover fieldset': { borderColor: alpha('#fff', 0.5) },
                '&.Mui-focused fieldset': { borderColor: '#fff' },
              },
              '& input::placeholder': {
                color: alpha('#fff', 0.7),
                opacity: 1,
              }
            }}
          />
          <IconButton onClick={handleReply} sx={{ color: 'white' }}>
            <SendIcon />
          </IconButton>
        </Box>

        {/* Navigation areas */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20%',
            height: '60%',
            cursor: 'pointer',
            zIndex: 1,
          }}
          onClick={onPrevious}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20%',
            height: '60%',
            cursor: 'pointer',
            zIndex: 1,
          }}
          onClick={onNext}
        />
      </Box>
    </StatusDialog>
  );
};

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

const StatusSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
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
  const [activeTab, setActiveTab] = useState(0); // 0: Chats, 1: Status
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

  // Status state
  const [statuses, setStatuses] = useState([]);
  const [myStatus, setMyStatus] = useState(null);
  const [statusViewerOpen, setStatusViewerOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [newStatusDialog, setNewStatusDialog] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [statusType, setStatusType] = useState('text');

  // Socket integration using custom hook
  const socket = useChatSocket(SOCKET_SERVER_URL, token, loggedInUserId, selectedUser);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mock status data - In real app, this would come from backend
  useEffect(() => {
    // Mock statuses
    const mockStatuses = [
      {
        _id: 'status1',
        userId: 'user1',
        name: 'John Doe',
        avatar: avatar1,
        stories: [
          {
            id: '1',
            type: 'text',
            content: 'Having a great day! 🌟',
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            type: 'text',
            content: 'Life is beautiful ✨',
            backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          }
        ],
        viewedBy: [],
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'status2',
        userId: 'user2',
        name: 'Jane Smith',
        avatar: avatar1,
        stories: [
          {
            id: '3',
            type: 'text',
            content: 'Working from home today 💻',
            backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          }
        ],
        viewedBy: [],
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setStatuses(mockStatuses);
    
    // Mock my status
    setMyStatus({
      _id: 'myStatus',
      userId: loggedInUserId,
      name: loggedInUser?.name || 'Me',
      avatar: avatar1,
      stories: [],
      viewedBy: [],
      timestamp: null,
    });
  }, [loggedInUserId, loggedInUser]);

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

  // Status handlers
  const handleStatusClick = (status) => {
    setCurrentStatus(status);
    setCurrentStoryIndex(0);
    setStatusViewerOpen(true);
  };

  const handleStatusNext = () => {
    if (currentStatus && currentStoryIndex < currentStatus.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      // Move to next status or close
      const currentStatusIndex = statuses.findIndex(s => s._id === currentStatus._id);
      if (currentStatusIndex < statuses.length - 1) {
        const nextStatus = statuses[currentStatusIndex + 1];
        setCurrentStatus(nextStatus);
        setCurrentStoryIndex(0);
      } else {
        setStatusViewerOpen(false);
      }
    }
  };

  const handleStatusPrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      // Move to previous status
      const currentStatusIndex = statuses.findIndex(s => s._id === currentStatus._id);
      if (currentStatusIndex > 0) {
        const prevStatus = statuses[currentStatusIndex - 1];
        setCurrentStatus(prevStatus);
        setCurrentStoryIndex(prevStatus.stories.length - 1);
      }
    }
  };

  const handleCreateStatus = () => {
    if (!statusText.trim()) return;

    const newStory = {
      id: Date.now().toString(),
      type: statusType,
      content: statusText,
      backgroundColor: statusType === 'text' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : null,
      timestamp: new Date().toISOString(),
    };

    setMyStatus(prev => ({
      ...prev,
      stories: [...(prev?.stories || []), newStory],
      timestamp: new Date().toISOString(),
    }));

    setStatusText('');
    setNewStatusDialog(false);
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          indicatorColor="primary"
        >
          <Tab label="Chats" />
          <Tab label="Status" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
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
        </>
      )}

      {activeTab === 1 && (
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {/* My Status */}
          <StatusSection>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              My Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <StatusRing hasStatus={myStatus?.stories?.length > 0} isViewed={false}>
                  <Avatar
                    src={avatar1}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {getInitials(loggedInUser?.name)}
                  </Avatar>
                </StatusRing>
                <Fab
                  size="small"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 28,
                    height: 28,
                    minHeight: 28,
                  }}
                  onClick={() => setNewStatusDialog(true)}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </Fab>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  My Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {myStatus?.stories?.length > 0 ? 
                    `${myStatus.stories.length} update${myStatus.stories.length > 1 ? 's' : ''}` : 
                    'Tap to add status update'
                  }
                </Typography>
              </Box>
            </Box>
          </StatusSection>

          {/* Others' Status */}
          <StatusSection>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Updates
            </Typography>
            <List sx={{ p: 0 }}>
              {statuses.map((status, index) => (
                <React.Fragment key={status._id}>
                  <ListItem
                    sx={{ cursor: 'pointer', px: 0, py: 1 }}
                    onClick={() => handleStatusClick(status)}
                  >
                    <ListItemAvatar>
                      <StatusRing 
                        hasStatus={status.stories.length > 0} 
                        isViewed={status.viewedBy.includes(loggedInUserId)}
                      >
                        <Avatar
                          src={status.avatar}
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main'
                          }}
                        >
                          {getInitials(status.name)}
                        </Avatar>
                      </StatusRing>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {status.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(status.timestamp), 'h:mm a')}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        {status.stories.length}
                      </Typography>
                      <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </Box>
                  </ListItem>
                  {index < statuses.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </StatusSection>
        </Box>
      )}
    </ChatListContainer>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Status Viewer */}
      <StatusViewer
        open={statusViewerOpen}
        onClose={() => setStatusViewerOpen(false)}
        status={currentStatus}
        currentIndex={currentStoryIndex}
        onNext={handleStatusNext}
        onPrevious={handleStatusPrevious}
      />

      {/* New Status Dialog */}
      <Dialog
        open={newStatusDialog}
        onClose={() => setNewStatusDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            Add Status Update
            <IconButton onClick={() => setNewStatusDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Tabs 
              value={statusType === 'text' ? 0 : 1} 
              onChange={(e, newValue) => setStatusType(newValue === 0 ? 'text' : 'image')}
            >
              <Tab label="Text" />
              <Tab label="Photo" />
            </Tabs>
          </Box>
          {statusType === 'text' ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Type your status..."
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              sx={{ mt: 2 }}
            />
          ) : (
            <Box sx={{ 
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              mt: 2 
            }}>
              <CameraIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                Photo upload coming soon...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewStatusDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateStatus} 
            variant="contained"
            disabled={!statusText.trim()}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>

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