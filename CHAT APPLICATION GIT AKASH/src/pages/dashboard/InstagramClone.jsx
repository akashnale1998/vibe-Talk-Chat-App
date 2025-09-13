import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  TextField,
  Button,
  Chip,
  Grid,
  Box,
  Paper,
  Divider,
  Badge,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Container,
  Tab,
  Tabs,
  InputAdornment,
  Slide,
  Zoom,
  Grow
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  BookmarkBorder,
  Bookmark,
  MoreVert,
  Search,
  Add,
  Home,
  Person,
  Camera,
  Send,
  PhotoCamera,
  LocationOn,
  Verified
} from '@mui/icons-material';

const InstagramClone = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Alex Johnson',
        username: 'alex_photography',
        avatar: 'https://i.pravatar.cc/150?img=1',
        verified: true
      },
      image: 'https://picsum.photos/600/600?random=1',
      caption: 'Golden hour magic ✨ Shot this during my evening walk in Central Park. The way light dances through the trees never gets old! 🌅 #photography #goldenhour #nature',
      location: 'Central Park, New York',
      likes: 1247,
      comments: [
        { user: 'emma_travels', avatar: 'https://i.pravatar.cc/50?img=2', text: 'Absolutely stunning! 😍' },
        { user: 'photo_enthusiast', avatar: 'https://i.pravatar.cc/50?img=3', text: 'What camera settings did you use?' },
        { user: 'nature_lover', avatar: 'https://i.pravatar.cc/50?img=4', text: 'This is pure art! 🎨' }
      ],
      timestamp: '2 hours ago',
      isLiked: false,
      isBookmarked: false,
      tags: ['photography', 'goldenhour', 'nature']
    },
    {
      id: 2,
      user: {
        name: 'Sarah Chen',
        username: 'foodie_sarah',
        avatar: 'https://i.pravatar.cc/150?img=5',
        verified: false
      },
      image: 'https://picsum.photos/600/600?random=2',
      caption: 'Homemade ramen bowl 🍜 Spent 3 hours making the perfect broth from scratch. The secret ingredient? Love and patience! Recipe coming to my blog soon 💕',
      location: 'Tokyo, Japan',
      likes: 892,
      comments: [
        { user: 'ramen_master', avatar: 'https://i.pravatar.cc/50?img=6', text: 'This looks incredible! Drop that recipe! 🔥' },
        { user: 'cooking_with_mom', avatar: 'https://i.pravatar.cc/50?img=7', text: 'My mouth is watering! 🤤' }
      ],
      timestamp: '5 hours ago',
      isLiked: true,
      isBookmarked: false,
      tags: ['food', 'ramen', 'cooking', 'homemade']
    },
    {
      id: 3,
      user: {
        name: 'Marcus Williams',
        username: 'fitness_marcus',
        avatar: 'https://i.pravatar.cc/150?img=8',
        verified: true
      },
      image: 'https://picsum.photos/600/600?random=3',
      caption: 'Morning workout complete! 💪 Nothing beats starting the day with some fresh air and endorphins. Remember: your only competition is who you were yesterday! 🚀',
      location: 'Venice Beach, CA',
      likes: 2134,
      comments: [
        { user: 'gym_buddy', avatar: 'https://i.pravatar.cc/50?img=9', text: 'Motivation at its finest! 🔥' },
        { user: 'wellness_warrior', avatar: 'https://i.pravatar.cc/50?img=10', text: 'Love this mindset! 💯' }
      ],
      timestamp: '1 day ago',
      isLiked: false,
      isBookmarked: true,
      tags: ['fitness', 'motivation', 'workout', 'mindset']
    }
  ]);

  const [stories, setStories] = useState([
    { id: 1, user: 'Your Story', username: 'your_story', avatar: null, isOwn: true, hasNew: false },
    { id: 2, user: 'Alex', username: 'alex_photography', avatar: 'https://i.pravatar.cc/100?img=1', hasNew: true },
    { id: 3, user: 'Sarah', username: 'foodie_sarah', avatar: 'https://i.pravatar.cc/100?img=5', hasNew: true },
    { id: 4, user: 'Marcus', username: 'fitness_marcus', avatar: 'https://i.pravatar.cc/100?img=8', hasNew: false },
    { id: 5, user: 'Emma', username: 'emma_travels', avatar: 'https://i.pravatar.cc/100?img=2', hasNew: true },
    { id: 6, user: 'David', username: 'tech_david', avatar: 'https://i.pravatar.cc/100?img=11', hasNew: false },
    { id: 7, user: 'Luna', username: 'art_luna', avatar: 'https://i.pravatar.cc/100?img=12', hasNew: true }
  ]);

  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    image: '',
    caption: '',
    location: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState({
    name: 'John Smith',
    username: 'john_smith',
    bio: '📸 Digital Creator | 🌍 Travel Enthusiast | ☕ Coffee Addict\n✨ Capturing moments that matter\n📍 Based in NYC',
    followers: '12.4K',
    following: '892',
    posts: '156',
    avatar: 'https://i.pravatar.cc/150?img=13',
    verified: false,
    website: 'www.johnsmith.com'
  });

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (newPost.caption) {
      const post = {
        id: posts.length + 1,
        user: {
          name: profile.name,
          username: profile.username,
          avatar: profile.avatar,
          verified: profile.verified
        },
        image: newPost.image || `https://picsum.photos/600/600?random=${posts.length + 10}`,
        caption: newPost.caption,
        location: newPost.location,
        likes: 0,
        comments: [],
        timestamp: 'now',
        isLiked: false,
        isBookmarked: false,
        tags: []
      };
      setPosts([post, ...posts]);
      setNewPost({ image: '', caption: '', location: '' });
      setCreatePostOpen(false);
      setCurrentTab(0);
    }
  };

  const renderStories = () => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 1, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {stories.map(story => (
          <Box key={story.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={story.isOwn ? <Add sx={{ fontSize: 16, color: '#1976d2' }} /> : null}
              invisible={!story.isOwn}
            >
              <Avatar
                src={story.avatar}
                sx={{
                  width: 64,
                  height: 64,
                  border: story.hasNew ? '3px solid' : '2px solid rgba(255,255,255,0.3)',
                  borderImage: story.hasNew 
                    ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%) 1'
                    : 'none',
                  background: story.isOwn ? 'linear-gradient(45deg, #2196F3, #21CBF3)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                {story.isOwn && <Camera sx={{ color: 'white' }} />}
              </Avatar>
            </Badge>
            <Typography variant="caption" sx={{ mt: 0.5, color: 'white', fontWeight: 500, textAlign: 'center' }}>
              {story.user}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );

  const renderPosts = () => (
    <Box sx={{ pb: 8 }}>
      {posts.map((post, index) => (
        <Grow in={true} timeout={300 + index * 100} key={post.id}>
          <Card sx={{ mb: 3, borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardHeader
              avatar={
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={post.user.verified ? <Verified sx={{ fontSize: 16, color: '#1976d2' }} /> : null}
                  invisible={!post.user.verified}
                >
                  <Avatar src={post.user.avatar} sx={{ width: 48, height: 48 }} />
                </Badge>
              }
              action={
                <IconButton>
                  <MoreVert />
                </IconButton>
              }
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {post.user.name}
                  </Typography>
                  {post.user.verified && <Verified sx={{ fontSize: 16, color: '#1976d2' }} />}
                </Box>
              }
              subheader={
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    @{post.user.username} • {post.timestamp}
                  </Typography>
                  {post.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LocationOn sx={{ fontSize: 14, color: '#1976d2', mr: 0.5 }} />
                      <Typography variant="caption" color="primary">
                        {post.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            />
            
            <CardMedia
              component="img"
              height="400"
              image={post.image}
              alt="Post image"
              onDoubleClick={() => handleLike(post.id)}
              sx={{ cursor: 'pointer' }}
            />
            
            <CardActions sx={{ px: 2, py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    onClick={() => handleLike(post.id)}
                    sx={{ 
                      color: post.isLiked ? '#f44336' : 'inherit',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  >
                    {post.isLiked ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton>
                    <ChatBubbleOutline />
                  </IconButton>
                  <IconButton>
                    <Send />
                  </IconButton>
                </Box>
                <IconButton 
                  onClick={() => handleBookmark(post.id)}
                  sx={{ color: post.isBookmarked ? '#1976d2' : 'inherit' }}
                >
                  {post.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Box>
            </CardActions>
            
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                {post.likes.toLocaleString()} likes
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>{post.user.username}</strong> {post.caption}
              </Typography>
              
              {post.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {post.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={`#${tag}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.75rem',
                        height: 24,
                        color: '#1976d2',
                        borderColor: '#1976d2',
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                      }}
                    />
                  ))}
                </Box>
              )}
              
              {post.comments.length > 0 && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, cursor: 'pointer' }}>
                    View all {post.comments.length} comments
                  </Typography>
                  
                  {post.comments.slice(0, 2).map((comment, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Avatar src={comment.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="body2">
                        <strong>{comment.user}</strong> {comment.text}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar src={profile.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                <TextField
                  variant="standard"
                  placeholder="Add a comment..."
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: '0.875rem' }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grow>
      ))}
    </Box>
  );

  const renderSearch = () => (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users, tags, or locations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))',
          }
        }}
      />
      
      <Grid container spacing={1}>
        {[...Array(12)].map((_, i) => (
          <Grid item xs={4} key={i}>
            <Paper
              elevation={0}
              sx={{
                aspectRatio: '1',
                background: `linear-gradient(135deg, ${['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][i % 6]} 0%, ${['#764ba2', '#667eea', '#f5576c', '#f093fb', '#00f2fe', '#4facfe'][i % 6]} 100%)`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' }
              }}
            >
              <PhotoCamera sx={{ fontSize: 32, color: 'white', opacity: 0.7 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderProfile = () => (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 2, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={profile.avatar}
            sx={{ 
              width: 100, 
              height: 100, 
              mr: 3,
              border: '4px solid rgba(255,255,255,0.3)'
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mr: 1 }}>
                {profile.name}
              </Typography>
              {profile.verified && <Verified sx={{ color: '#1976d2' }} />}
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              @{profile.username}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">{profile.posts}</Typography>
                <Typography variant="caption">Posts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">{profile.followers}</Typography>
                <Typography variant="caption">Followers</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">{profile.following}</Typography>
                <Typography variant="caption">Following</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2, lineHeight: 1.6 }}>
          {profile.bio}
        </Typography>
        
        {profile.website && (
          <Typography variant="body2" sx={{ color: '#90caf9', textDecoration: 'underline', cursor: 'pointer' }}>
            {profile.website}
          </Typography>
        )}
      </Paper>
      
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1}>
          {[...Array(9)].map((_, i) => (
            <Grid item xs={4} key={i}>
              <Paper
                elevation={0}
                sx={{
                  aspectRatio: '1',
                  background: `url(https://picsum.photos/200/200?random=${i + 20})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 300, letterSpacing: 2 }}>
            InstaClone
          </Typography>
          <IconButton color="inherit">
            <Camera />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2 }, pt: 2 }}>
        {currentTab === 0 && (
          <>
            {renderStories()}
            {renderPosts()}
          </>
        )}
        {currentTab === 1 && renderSearch()}
        {currentTab === 2 && renderProfile()}
      </Container>

      {/* Create Post FAB */}
      <Zoom in={currentTab === 0}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            background: 'linear-gradient(45deg, #f09433 0%, #bc1888 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #e6683c 0%, #cc2366 100%)',
            }
          }}
          onClick={() => setCreatePostOpen(true)}
        >
          <Add />
        </Fab>
      </Zoom>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 500,
          zIndex: 1000,
          borderRadius: '20px 20px 0 0',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }} 
        elevation={8}
      >
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              '&.Mui-selected': {
                color: '#bc1888',
                transform: 'scale(1.1)'
              }
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(45deg, #f09433 0%, #bc1888 100%)',
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab icon={<Home />} />
          <Tab icon={<Search />} />
          <Tab icon={<Person />} />
        </Tabs>
      </Paper>

      {/* Create Post Dialog */}
      <Dialog 
        open={createPostOpen} 
        onClose={() => setCreatePostOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #f09433 0%, #bc1888 100%)',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Create New Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL (optional)"
            fullWidth
            variant="outlined"
            value={newPost.image}
            onChange={(e) => setNewPost({...newPost, image: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={newPost.location}
            onChange={(e) => setNewPost({...newPost, location: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="What's on your mind?"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newPost.caption}
            onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
          />
          {newPost.image && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={newPost.image} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setCreatePostOpen(false)} sx={{ borderRadius: 3 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPost.caption.trim()}
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(45deg, #f09433 0%, #bc1888 100%)',
              px: 3
            }}
          >
            Share Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstagramClone;