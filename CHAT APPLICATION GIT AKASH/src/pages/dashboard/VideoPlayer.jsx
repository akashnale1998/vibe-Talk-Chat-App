// components/VideoPlayer.jsx
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ streamUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;

    if (videoRef.current) {
      if (Hls.isSupported() && streamUrl.endsWith('.m3u8')) {
        hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
      } else {
        videoRef.current.src = streamUrl; // Fallback for MP4
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      controls
      muted
      autoPlay
      width="100%"
      height="170"
      style={{ objectFit: 'cover' }}
    />
  );
};

export default VideoPlayer;
