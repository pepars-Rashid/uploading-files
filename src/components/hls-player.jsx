"use client";

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector'; // Add this package

export default function SimpleHLSPlayer({ url }) {
  const videoRef = useRef(null);
  const playerRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;

    // Register quality selector plugin
    (videojs).HlsQualitySelector = require('videojs-hls-quality-selector');
    
    const player = playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      fluid: true,
      sources: [{
        src: url,
        type: 'application/x-mpegURL'
      }]
    });

    // Initialize quality selector
    player.hlsQualitySelector({
      displayCurrentQuality: true,
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [url]);

  return (
    <div data-vjs-player>
      <video 
        ref={videoRef} 
        className="video-js" 
        playsInline
        crossOrigin="anonymous"
      />
    </div>
  );
}