import React, { useState, useMemo } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Card,
    CardMedia,
    CardContent,
    Avatar,
    Grid,
    Chip,
    Container,
    Paper,
    Divider,
    Badge,
    Button,
    ListItemButton,
    ListItemAvatar,
    Tooltip,
    Stack,
    Fade,
    Skeleton
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    VideoCall as VideoCallIcon,
    Notifications as NotificationsIcon,
    Home as HomeIcon,
    Whatshot as TrendingIcon,
    Subscriptions as SubscriptionsIcon,
    VideoLibrary as LibraryIcon,
    History as HistoryIcon,
    WatchLater as WatchLaterIcon,
    ThumbUp as ThumbUpIcon,
    ExpandMore as ExpandMoreIcon,
    Settings as SettingsIcon,
    Flag as FlagIcon,
    Help as HelpIcon,
    Feedback as FeedbackIcon,
    MoreVert as MoreVertIcon,
    CheckCircle as VerifiedIcon,
    PlayArrow as PlayArrowIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon
} from '@mui/icons-material';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';

// Custom styled components
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 4,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
    '&:focus-within': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    marginLeft: 0,
    width: '100%',
    maxWidth: 640,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
    borderRadius: `0 ${theme.shape.borderRadius * 4}px ${theme.shape.borderRadius * 4}px 0`,
    cursor: 'pointer',
    transition: theme.transitions.create('background-color'),
    '&:hover': {
        backgroundColor: alpha(theme.palette.action.hover, 0.2),
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.2, 6, 1.2, 2),
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: '1rem',
    },
}));

const VideoCardContainer = styled(Card)(({ theme }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)',
    },
}));

const drawerWidth = 240;

// Mock data
const mockVideos = [
    {
        id: 1,
        title: "Building a Full Stack App with React and Node.js - Complete Tutorial 2024",
        channel: "Tech Tutorials Pro",
        channelAvatar: "TT",
        views: "1.2M views",
        uploadTime: "3 days ago",
        duration: "15:30",
        thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop&auto=format&q=80",
        verified: true,
        category: "tutorial"
    },
    {
        id: 2,
        title: "10 JavaScript Tips Every Developer Should Know in 2024 - Advanced Techniques",
        channel: "Code Master",
        channelAvatar: "CM",
        views: "856K views",
        uploadTime: "1 week ago",
        duration: "12:45",
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop&auto=format&q=80",
        verified: false,
        category: "javascript"
    },
    {
        id: 3,
        title: "CSS Grid vs Flexbox - Complete Guide for Modern Web Development",
        channel: "Design Pro",
        channelAvatar: "DP",
        views: "2.3M views",
        uploadTime: "2 weeks ago",
        duration: "18:22",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop&auto=format&q=80",
        verified: true,
        category: "css"
    },
    {
        id: 4,
        title: "Python Machine Learning Tutorial - From Beginner to Advanced",
        channel: "Data Science Hub",
        channelAvatar: "DS",
        views: "945K views",
        uploadTime: "4 days ago",
        duration: "25:15",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop&auto=format&q=80",
        verified: true,
        category: "python"
    },
    {
        id: 5,
        title: "Docker for Beginners - Complete DevOps Course 2024",
        channel: "DevOps Academy",
        channelAvatar: "DA",
        views: "1.8M views",
        uploadTime: "1 month ago",
        duration: "45:30",
        thumbnail: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=225&fit=crop&auto=format&q=80",
        verified: true,
        category: "devops"
    },
    {
        id: 6,
        title: "React Hooks Explained with Real World Examples - useState, useEffect, Custom Hooks",
        channel: "Frontend Focus",
        channelAvatar: "FF",
        views: "623K views",
        uploadTime: "5 days ago",
        duration: "22:18",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&auto=format&q=80",
        verified: false,
        category: "react"
    },
    {
        id: 7,
        title: "Advanced TypeScript Patterns and Best Practices for Enterprise Development",
        channel: "Type Masters",
        channelAvatar: "TM",
        views: "432K views",
        uploadTime: "2 days ago",
        duration: "28:45",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop&auto=format&q=80",
        verified: false,
        category: "typescript"
    },
    {
        id: 8,
        title: "Web Design Trends 2024 - What's Hot in UI/UX Design",
        channel: "Design Trends",
        channelAvatar: "DT",
        views: "1.5M views",
        uploadTime: "1 week ago",
        duration: "20:12",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop&auto=format&q=80",
        verified: true,
        category: "design"
    }
];

const categories = [
    { label: "All", value: "all" },
    { label: "JavaScript", value: "javascript" },
    { label: "React", value: "react" },
    { label: "Node.js", value: "nodejs" },
    { label: "Python", value: "python" },
    { label: "TypeScript", value: "typescript" },
    { label: "CSS", value: "css" },
    { label: "DevOps", value: "devops" },
    { label: "Design", value: "design" },
    { label: "Tutorial", value: "tutorial" },
    { label: "Live", value: "live" }
];

const sidebarSections = {
    main: [
        { icon: HomeIcon, label: "Home", active: true },
        { icon: TrendingIcon, label: "Trending" },
        { icon: SubscriptionsIcon, label: "Subscriptions" }
    ],
    library: [
        { icon: LibraryIcon, label: "Library" },
        { icon: HistoryIcon, label: "History" },
        { icon: VideoCallIcon, label: "Your videos" },
        { icon: WatchLaterIcon, label: "Watch later" },
        { icon: ThumbUpIcon, label: "Liked videos" },
        { icon: ExpandMoreIcon, label: "Show more" }
    ],
    settings: [
        { icon: SettingsIcon, label: "Settings" },
        { icon: FlagIcon, label: "Report history" },
        { icon: HelpIcon, label: "Help" },
        { icon: FeedbackIcon, label: "Send feedback" }
    ]
};

const subscriptions = [
    { name: "Tech Channel", avatar: "TC", color: "#1976d2", subscribers: "2.1M" },
    { name: "Music Hub", avatar: "MH", color: "#d32f2f", subscribers: "5.8M" },
    { name: "Gaming Pro", avatar: "GP", color: "#388e3c", subscribers: "3.2M" },
    { name: "Education Plus", avatar: "EP", color: "#f57c00", subscribers: "1.7M" },
    { name: "Fitness Guide", avatar: "FG", color: "#7b1fa2", subscribers: "4.3M" }
];

// VideoCard Component with optimized performance
const VideoCard = React.memo(({ video, loading = false }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(false);

    if (loading) {
        return (
            <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="90%" height={20} />
                            <Skeleton variant="text" width="60%" height={16} />
                            <Skeleton variant="text" width="40%" height={16} />
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <VideoCardContainer
            onMouseEnter={() => setShowPlayButton(true)}
            onMouseLeave={() => setShowPlayButton(false)}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={video.thumbnail}
                    alt={video.title}
                    onLoad={() => setImageLoaded(true)}
                    sx={{
                        transition: 'transform 0.3s ease-in-out',
                        transform: showPlayButton ? 'scale(1.05)' : 'scale(1)'
                    }}
                />

                <Chip
                    label={video.duration}
                    size="small"
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}
                />

                <Fade in={showPlayButton}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.9)',
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            <PlayArrowIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Fade>
            </Box>

            <CardContent sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            flexShrink: 0
                        }}
                    >
                        {video.channelAvatar}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Tooltip title={video.title} placement="top-start">
                            <Typography
                                variant="subtitle2"
                                component="h3"
                                sx={{
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    mb: 0.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: 'primary.main'
                                    },
                                    transition: 'color 0.2s ease-in-out'
                                }}
                            >
                                {video.title}
                            </Typography>
                        </Tooltip>

                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    '&:hover': { color: 'text.primary' },
                                    transition: 'color 0.2s ease-in-out',
                                    cursor: 'pointer'
                                }}
                            >
                                {video.channel}
                            </Typography>
                            {video.verified && (
                                <Tooltip title="Verified">
                                    <VerifiedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                </Tooltip>
                            )}
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                            {video.views} • {video.uploadTime}
                        </Typography>
                    </Box>

                    <Fade in={showPlayButton}>
                        <IconButton
                            size="small"
                            sx={{
                                alignSelf: 'flex-start',
                                mt: 0.5
                            }}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Fade>
                </Box>
            </CardContent>
        </VideoCardContainer>
    );
});

VideoCard.displayName = 'VideoCard';

// Main App Component
function YouTubeClone() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(false);

    // Create theme
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    primary: {
                        main: '#FF0000',
                    },
                    background: {
                        default: darkMode ? '#0f0f0f' : '#f9f9f9',
                        paper: darkMode ? '#212121' : '#ffffff',
                    },
                },
                components: {
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 12,
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                textTransform: 'none',
                                borderRadius: 8,
                            },
                        },
                    },
                },
            }),
        [darkMode],
    );

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setLoading(true);
        // Simulate loading
        setTimeout(() => setLoading(false), 500);
    };

    // Memoized filtered videos
    const filteredVideos = useMemo(() => {
        if (selectedCategory === "all") return mockVideos;
        return mockVideos.filter(video =>
            video.category === selectedCategory ||
            video.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            video.channel.toLowerCase().includes(selectedCategory.toLowerCase())
        );
    }, [selectedCategory]);

    const drawer = (
        <Box sx={{ overflow: 'auto', height: '100%' }}>
            <Toolbar />

            {/* Main Navigation */}
            <List dense>
                {sidebarSections.main.map((item) => (
                    <ListItemButton
                        key={item.label}
                        selected={item.active}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                backgroundColor: 'action.selected',
                                '& .MuiListItemIcon-root': {
                                    color: 'primary.main'
                                },
                                '& .MuiListItemText-primary': {
                                    fontWeight: 600
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <item.icon />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Library */}
            <List dense>
                <ListItem sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        LIBRARY
                    </Typography>
                </ListItem>
                {sidebarSections.library.map((item) => (
                    <ListItemButton
                        key={item.label}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            mb: 0.5
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <item.icon />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Subscriptions */}
            <List dense>
                <ListItem sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        SUBSCRIPTIONS
                    </Typography>
                </ListItem>
                {subscriptions.map((subscription) => (
                    <ListItemButton
                        key={subscription.name}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            mb: 0.5
                        }}
                    >
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                            <Avatar
                                sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: '0.75rem',
                                    bgcolor: subscription.color
                                }}
                            >
                                {subscription.avatar}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={subscription.name}
                            secondary={subscription.subscribers}
                        />
                    </ListItemButton>
                ))}
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Settings */}
            <List dense>
                {sidebarSections.settings.map((item) => (
                    <ListItemButton
                        key={item.label}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            mb: 0.5
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <item.icon />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
                {/* AppBar */}
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                            <Typography
                                variant="h5"
                                noWrap
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#FF0000',
                                    mr: 0.5
                                }}
                            >
                                📺
                            </Typography>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary'
                                }}
                            >
                                YouTube
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <Search>
                                <StyledInputBase
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                            </Search>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
                                <IconButton
                                    color="inherit"
                                    onClick={() => setDarkMode(!darkMode)}
                                >
                                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Create">
                                <IconButton color="inherit">
                                    <VideoCallIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Notifications">
                                <IconButton color="inherit">
                                    <Badge badgeContent={3} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Account">
                                <IconButton color="inherit">
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                        U
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Drawers */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            zIndex: 1300 // Make sure it's above AppBar
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid',
                            borderColor: 'divider'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>

                {/* Main content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        bgcolor: 'background.default',
                        minHeight: '100vh'
                    }}
                >
                    <Toolbar />

                    {/* Categories */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            position: 'sticky',
                            top: 64,
                            zIndex: 10,
                            bgcolor: 'background.paper'
                        }}
                    >
                        <Box sx={{
                            px: 3,
                            py: 2,
                            display: 'flex',
                            gap: 1,
                            overflowX: 'auto',
                            '&::-webkit-scrollbar': { display: 'none' },
                            scrollbarWidth: 'none'
                        }}>
                            {categories.map((category) => (
                                <Chip
                                    key={category.value}
                                    label={category.label}
                                    clickable
                                    variant={selectedCategory === category.value ? "filled" : "outlined"}
                                    onClick={() => handleCategoryChange(category.value)}
                                    sx={{
                                        minWidth: 'auto',
                                        fontWeight: selectedCategory === category.value ? 600 : 400,
                                        bgcolor: selectedCategory === category.value ? 'text.primary' : 'transparent',
                                        color: selectedCategory === category.value ? 'background.paper' : 'text.primary',
                                        borderColor: 'divider',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            bgcolor: selectedCategory === category.value ? 'text.primary' : 'action.hover',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>

                    {/* Video Grid */}
                    <Container maxWidth="xl" sx={{ py: 3 }}>
                        <Grid container spacing={2}>
                            {(loading ? Array(8).fill(null) : filteredVideos).map((video, index) => (
                                <Grid item xs={12} sm={6} md={4} key={video?.id || index}>
                                    <VideoCard video={video} loading={loading} />
                                </Grid>
                            ))}
                        </Grid>


                        {/* Load More Button */}
                        {!loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderRadius: 8,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    Load more videos
                                </Button>
                            </Box>
                        )}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default YouTubeClone;