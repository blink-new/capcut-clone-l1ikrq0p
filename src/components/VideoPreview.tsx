import React, { useEffect, useState } from 'react';

interface VideoClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  track: number;
}

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoClips: VideoClip[];
  currentTime: number;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
}

export function VideoPreview({
  videoRef,
  videoClips,
  currentTime,
  onTimeUpdate,
  onLoadedMetadata
}: VideoPreviewProps) {
  const [currentClip, setCurrentClip] = useState<VideoClip | null>(null);

  // Find the active clip based on current time
  useEffect(() => {
    const activeClip = videoClips.find(clip => 
      currentTime >= clip.startTime && currentTime <= clip.endTime
    );
    
    if (activeClip && activeClip !== currentClip) {
      setCurrentClip(activeClip);
    } else if (!activeClip && currentClip) {
      setCurrentClip(null);
    }
  }, [currentTime, videoClips, currentClip]);

  // Update video source when current clip changes
  useEffect(() => {
    if (videoRef.current && currentClip) {
      if (videoRef.current.src !== currentClip.url) {
        videoRef.current.src = currentClip.url;
        videoRef.current.load();
      }
    }
  }, [currentClip, videoRef]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {currentClip ? (
        <video
          ref={videoRef}
          className="max-w-full max-h-full object-contain"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          controls={false}
          playsInline
        />
      ) : (
        <div className="text-center text-gray-400">
          <div className="w-32 h-32 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Video Selected</h3>
          <p className="text-sm">
            Import a video file to start editing
          </p>
        </div>
      )}
      
      {/* Video Info Overlay */}
      {currentClip && (
        <div className="absolute top-4 left-4 bg-black/80 rounded-lg px-3 py-2">
          <p className="text-sm font-medium text-white">{currentClip.name}</p>
          <p className="text-xs text-gray-300">
            Track {currentClip.track + 1}
          </p>
        </div>
      )}
      
      {/* Resolution Info */}
      <div className="absolute top-4 right-4 bg-black/80 rounded-lg px-3 py-2">
        <p className="text-xs text-gray-300">1920 × 1080</p>
        <p className="text-xs text-gray-300">30 FPS</p>
      </div>
    </div>
  );
}