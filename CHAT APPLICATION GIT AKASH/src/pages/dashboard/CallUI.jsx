import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Paper,
  Fade,
  Backdrop,
  Button,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Call as CallIcon,
  CallEnd as CallEndIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  Fullscreen as FullscreenIcon,
  PictureInPicture as PictureInPictureIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const CallOverlay = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
}));

const CallContainer = styled(Paper)(({ theme, calltype }) => ({
  width: calltype === 'video' ? '90vw' : '400px',
  height: calltype === 'video' ? '90vh' : '500px',
  maxWidth: calltype === 'video' ? '1200px' : '400px',
  maxHeight: calltype === 'video' ? '800px' : '500px',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  background: calltype === 'video' ? '#000' : theme.palette.background.paper,
}));

const VideoContainer = styled(Box)({
  position: 'relative',
  flex: 1,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const RemoteVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  backgroundColor: '#000',
});

const LocalVideo = styled('video')(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  width: '200px',
  height: '150px',
  borderRadius: theme.spacing(1),
  objectFit: 'cover',
  backgroundColor: '#000',
  border: `2px solid ${theme.palette.primary.main}`,
  zIndex: 10,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CallControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3),
  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

const VoiceCallContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
}));

const CallButton = styled(IconButton)(({ theme, variant }) => {
  const baseStyle = {
    width: 56,
    height: 56,
    boxShadow: theme.shadows[4],
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };

  switch (variant) {
    case 'end':
      return {
        ...baseStyle,
        backgroundColor: '#f44336',
        color: '#fff',
        '&:hover': {
          ...baseStyle['&:hover'],
          backgroundColor: '#d32f2f',
        },
      };
    case 'answer':
      return {
        ...baseStyle,
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
          ...baseStyle['&:hover'],
          backgroundColor: '#388e3c',
        },
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        '&:hover': {
          ...baseStyle['&:hover'],
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
      };
  }
});

// Call Timer Component
const CallTimer = ({ startTime }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!startTime) return null;

  return (
    <Chip
      label={formatDuration(duration)}
      size="small"
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        fontFamily: 'monospace',
        zIndex: 10,
      }}
    />
  );
};

// Incoming Call Component
export const IncomingCall = ({ 
  caller, 
  callType, 
  onAnswer, 
  onReject,
  isRinging = true 
}) => {
  const theme = useTheme();
  const [ringAnimation, setRingAnimation] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRingAnimation(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <CallOverlay open={true}>
      <Fade in={true}>
        <CallContainer calltype="voice">
          <VoiceCallContainer>
            <Box sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  transform: ringAnimation ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.5s ease',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                {getInitials(caller?.name)}
              </Avatar>
              
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {caller?.name || 'Unknown Caller'}
              </Typography>
              
              <Typography variant="h6" sx={{ opacity: 0.8, mb: 2 }}>
                Incoming {callType} call...
              </Typography>

              {isRinging && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                      opacity: ringAnimation ? 1 : 0.3,
                      transition: 'opacity 0.5s ease',
                      mx: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                      opacity: !ringAnimation ? 1 : 0.3,
                      transition: 'opacity 0.5s ease',
                      mx: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                      opacity: ringAnimation ? 1 : 0.3,
                      transition: 'opacity 0.5s ease',
                      mx: 0.5,
                    }}
                  />
                </Box>
              )}
            </Box>

            <Stack direction="row" spacing={4}>
              <CallButton variant="end" onClick={onReject}>
                <CallEndIcon />
              </CallButton>
              
              <CallButton variant="answer" onClick={onAnswer}>
                {callType === 'video' ? <VideocamIcon /> : <CallIcon />}
              </CallButton>
            </Stack>
          </VoiceCallContainer>
        </CallContainer>
      </Fade>
    </CallOverlay>
  );
};

// Active Call Component
export const ActiveCall = ({
  callType,
  caller,
  callee,
  isIncoming,
  callStatus,
  localVideoRef,
  remoteVideoRef,
  onEndCall,
  onToggleVideo,
  onToggleAudio,
  localStream,
  remoteStream,
}) => {
  const theme = useTheme();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStartTime, setCallStartTime] = useState(null);
  const [isLocalVideoMinimized, setIsLocalVideoMinimized] = useState(false);

  useEffect(() => {
    if (callStatus === 'connected' && !callStartTime) {
      setCallStartTime(Date.now());
    }
  }, [callStatus, callStartTime]);

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    onToggleVideo();
  };

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    onToggleAudio();
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const otherUser = isIncoming ? caller : callee;

  if (callType === 'voice') {
    return (
      <CallOverlay open={true}>
        <Fade in={true}>
          <CallContainer calltype="voice">
            <VoiceCallContainer>
              <CallTimer startTime={callStartTime} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 3,
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {getInitials(otherUser?.name)}
                </Avatar>
                
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {otherUser?.name || 'Unknown'}
                </Typography>
                
                <Typography variant="h6" sx={{ opacity: 0.8, mb: 4 }}>
                  {callStatus === 'connected' ? 'Voice call active' : 'Connecting...'}
                </Typography>
              </Box>

              <Stack direction="row" spacing={3}>
                <CallButton onClick={handleToggleAudio}>
                  {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
                </CallButton>
                
                <CallButton variant="end" onClick={onEndCall}>
                  <CallEndIcon />
                </CallButton>
                
                <CallButton>
                  <VolumeUpIcon />
                </CallButton>
              </Stack>
            </VoiceCallContainer>
          </CallContainer>
        </Fade>
      </CallOverlay>
    );
  }

  return (
    <CallOverlay open={true}>
      <Fade in={true}>
        <CallContainer calltype="video">
          <VideoContainer>
            <CallTimer startTime={callStartTime} />
            
            {/* Remote Video */}
            {remoteStream ? (
              <RemoteVideo
                ref={remoteVideoRef}
                autoPlay
                playsInline
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000',
                }}
              >
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 2,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {getInitials(otherUser?.name)}
                  </Avatar>
                  <Typography variant="h6">
                    {callStatus === 'connected' ? 'Camera off' : 'Connecting...'}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Local Video */}
            {localStream && (
              <LocalVideo
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                onClick={() => setIsLocalVideoMinimized(!isLocalVideoMinimized)}
                sx={{
                  width: isLocalVideoMinimized ? '100px' : '200px',
                  height: isLocalVideoMinimized ? '75px' : '150px',
                }}
              />
            )}

            {/* Call Controls */}
            <CallControls>
              <Stack direction="row" spacing={2}>
                <CallButton onClick={handleToggleAudio}>
                  {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
                </CallButton>
                
                <CallButton onClick={handleToggleVideo}>
                  {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                </CallButton>
                
                <CallButton variant="end" onClick={onEndCall}>
                  <CallEndIcon />
                </CallButton>
                
                <CallButton>
                  <FullscreenIcon />
                </CallButton>
                
                <CallButton>
                  <PictureInPictureIcon />
                </CallButton>
              </Stack>
            </CallControls>
          </VideoContainer>
        </CallContainer>
      </Fade>
    </CallOverlay>
  );
};

// Call Status Component
export const CallStatus = ({ status, onClose }) => {
  const theme = useTheme();

  if (status === 'idle') return null;

  const statusConfig = {
    calling: {
      message: 'Calling...',
      color: theme.palette.info.main,
    },
    ringing: {
      message: 'Ringing...',
      color: theme.palette.warning.main,
    },
    connected: {
      message: 'Connected',
      color: theme.palette.success.main,
    },
    ended: {
      message: 'Call ended',
      color: theme.palette.error.main,
    },
  };

  const config = statusConfig[status] || statusConfig.ended;

  return (
    <Fade in={true}>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: theme.zIndex.snackbar,
          bgcolor: config.color,
          color: 'white',
          px: 3,
          py: 1,
          borderRadius: 2,
          boxShadow: theme.shadows[6],
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {config.message}
        </Typography>
      </Box>
    </Fade>
  );
};