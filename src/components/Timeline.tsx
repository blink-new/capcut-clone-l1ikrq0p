import React, { useRef, useCallback, useState } from 'react';
import { Card } from './ui/card';

interface VideoClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  track: number;
}

interface AudioClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
}

interface TimelineProps {
  videoClips: VideoClip[];
  audioClips: AudioClip[];
  currentTime: number;
  duration: number;
  zoom: number;
  selectedClip: string | null;
  onSeek: (time: number) => void;
  onClipSelect: (clipId: string | null) => void;
  onClipUpdate: (clipId: string, updates: Partial<VideoClip>) => void;
}

export function Timeline({
  videoClips,
  audioClips,
  currentTime,
  duration,
  zoom,
  selectedClip,
  onSeek,
  onClipSelect,
  onClipUpdate
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragClipId, setDragClipId] = useState<string | null>(null);

  const pixelsPerSecond = (zoom / 100) * 20; // Base 20px per second at 100% zoom
  const timelineWidth = duration * pixelsPerSecond;

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (timelineRef.current && !isDragging) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const time = x / pixelsPerSecond;
      onSeek(Math.max(0, Math.min(duration, time)));
    }
  }, [pixelsPerSecond, duration, onSeek, isDragging]);

  const handleClipMouseDown = useCallback((e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragClipId(clipId);
    onClipSelect(clipId);
  }, [onClipSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragClipId && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newStartTime = Math.max(0, x / pixelsPerSecond);
      
      const clip = videoClips.find(c => c.id === dragClipId);
      if (clip) {
        const clipDuration = clip.endTime - clip.startTime;
        onClipUpdate(dragClipId, {
          startTime: newStartTime,
          endTime: newStartTime + clipDuration
        });
      }
    }
  }, [isDragging, dragClipId, pixelsPerSecond, videoClips, onClipUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragClipId(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateTimeMarkers = () => {
    const markers = [];
    const interval = zoom < 50 ? 10 : zoom < 100 ? 5 : 1; // Adjust interval based on zoom
    
    for (let i = 0; i <= duration; i += interval) {
      markers.push(
        <div
          key={i}
          className="absolute top-0 bottom-0 border-l border-gray-600"
          style={{ left: `${i * pixelsPerSecond}px` }}
        >
          <span className="absolute -top-5 -left-4 text-xs text-gray-400">
            {formatTime(i)}
          </span>
        </div>
      );
    }
    return markers;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Timeline Header */}
      <div className="h-8 bg-gray-900 border-b border-gray-700 relative overflow-hidden">
        <div 
          className="relative h-full"
          style={{ width: `${timelineWidth}px` }}
        >
          {generateTimeMarkers()}
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Track Labels */}
          <div className="w-24 bg-gray-900 border-r border-gray-700">
            <div className="h-16 border-b border-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-300">Video 1</span>
            </div>
            <div className="h-12 border-b border-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-300">Audio 1</span>
            </div>
            <div className="h-12 border-b border-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-300">Audio 2</span>
            </div>
          </div>

          {/* Timeline Content */}
          <div 
            ref={timelineRef}
            className="flex-1 relative cursor-pointer"
            onClick={handleTimelineClick}
            style={{ width: `${timelineWidth}px`, minWidth: '100%' }}
          >
            {/* Video Track */}
            <div className="h-16 border-b border-gray-700 relative bg-gray-800">
              {videoClips.map((clip) => (
                <div
                  key={clip.id}
                  className={`absolute top-2 bottom-2 video-clip cursor-move rounded ${
                    selectedClip === clip.id ? 'ring-2 ring-[#FF6B35]' : ''
                  }`}
                  style={{
                    left: `${clip.startTime * pixelsPerSecond}px`,
                    width: `${(clip.endTime - clip.startTime) * pixelsPerSecond}px`,
                  }}
                  onMouseDown={(e) => handleClipMouseDown(e, clip.id)}
                >
                  <div className="h-full bg-[#FF6B35] rounded flex items-center px-2">
                    <span className="text-xs font-medium text-white truncate">
                      {clip.name}
                    </span>
                  </div>
                  {/* Resize handles */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize" />
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize" />
                </div>
              ))}
            </div>

            {/* Audio Tracks */}
            <div className="h-12 border-b border-gray-700 relative bg-gray-800">
              {audioClips.filter(clip => clip.startTime < 30).map((clip) => (
                <div
                  key={clip.id}
                  className={`absolute top-1 bottom-1 cursor-move rounded ${
                    selectedClip === clip.id ? 'ring-2 ring-[#4ECDC4]' : ''
                  }`}
                  style={{
                    left: `${clip.startTime * pixelsPerSecond}px`,
                    width: `${(clip.endTime - clip.startTime) * pixelsPerSecond}px`,
                  }}
                  onMouseDown={(e) => handleClipMouseDown(e, clip.id)}
                >
                  <div className="h-full bg-[#4ECDC4] rounded flex items-center px-2">
                    <span className="text-xs font-medium text-white truncate">
                      {clip.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-12 border-b border-gray-700 relative bg-gray-800">
              {/* Additional audio track */}
            </div>

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 playhead z-10 pointer-events-none"
              style={{ left: `${currentTime * pixelsPerSecond}px` }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#FF6B35] rounded-full border-2 border-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}