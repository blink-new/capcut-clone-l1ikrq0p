import React, { useState, useRef, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Scissors, Play, Pause, RotateCcw } from 'lucide-react';

interface VideoClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  track: number;
}

interface VideoTrimmerProps {
  clip: VideoClip;
  onTrim: (clipId: string, startTime: number, endTime: number) => void;
  onSplit: (clipId: string, splitTime: number) => void;
  onClose: () => void;
}

export function VideoTrimmer({ clip, onTrim, onSplit, onClose }: VideoTrimmerProps) {
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(clip.duration);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [splitTime, setSplitTime] = useState(clip.duration / 2);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Auto-pause at trim end
      if (videoRef.current.currentTime >= trimEnd) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [trimEnd]);

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      const clampedTime = Math.max(trimStart, Math.min(trimEnd, time));
      videoRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    }
  }, [trimStart, trimEnd]);

  const handleTrimStartChange = useCallback((value: number[]) => {
    const newStart = value[0];
    setTrimStart(newStart);
    if (currentTime < newStart) {
      handleSeek(newStart);
    }
  }, [currentTime, handleSeek]);

  const handleTrimEndChange = useCallback((value: number[]) => {
    const newEnd = value[0];
    setTrimEnd(newEnd);
    if (currentTime > newEnd) {
      handleSeek(newEnd);
    }
  }, [currentTime, handleSeek]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleApplyTrim = () => {
    onTrim(clip.id, trimStart, trimEnd);
    onClose();
  };

  const handleSplitClip = () => {
    onSplit(clip.id, splitTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-[800px] max-h-[90vh] bg-gray-900 border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Trim & Split Video</h2>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Video Preview */}
          <div className="bg-black rounded-lg mb-6 relative">
            <video
              ref={videoRef}
              src={clip.url}
              className="w-full h-64 object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setTrimEnd(videoRef.current.duration);
                }
              }}
            />
            
            {/* Playback Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-lg px-4 py-2 flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(clip.duration)}
              </span>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="mb-6">
            <div className="relative h-12 bg-gray-800 rounded-lg overflow-hidden">
              {/* Timeline background */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600" />
              
              {/* Trim range indicator */}
              <div 
                className="absolute top-0 bottom-0 bg-[#FF6B35]/30 border-l-2 border-r-2 border-[#FF6B35]"
                style={{
                  left: `${(trimStart / clip.duration) * 100}%`,
                  width: `${((trimEnd - trimStart) / clip.duration) * 100}%`
                }}
              />
              
              {/* Current time indicator */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                style={{ left: `${(currentTime / clip.duration) * 100}%` }}
              >
                <div className="absolute -top-1 -left-2 w-4 h-4 bg-white rounded-full" />
              </div>
              
              {/* Split time indicator */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-[#4ECDC4] z-10"
                style={{ left: `${(splitTime / clip.duration) * 100}%` }}
              >
                <div className="absolute -top-1 -left-2 w-4 h-4 bg-[#4ECDC4] rounded-full" />
              </div>

              {/* Clickable timeline */}
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const time = (x / rect.width) * clip.duration;
                  handleSeek(time);
                }}
              />
            </div>
          </div>

          {/* Trim Controls */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Trim Video</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Start Time: {formatTime(trimStart)}
                  </label>
                  <Slider
                    value={[trimStart]}
                    onValueChange={handleTrimStartChange}
                    max={clip.duration}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    End Time: {formatTime(trimEnd)}
                  </label>
                  <Slider
                    value={[trimEnd]}
                    onValueChange={handleTrimEndChange}
                    max={clip.duration}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Duration: {formatTime(trimEnd - trimStart)}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setTrimStart(0);
                      setTrimEnd(clip.duration);
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Split Controls */}
            <div>
              <h3 className="text-lg font-medium mb-4">Split Video</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Split at: {formatTime(splitTime)}
                  </label>
                  <Slider
                    value={[splitTime]}
                    onValueChange={(value) => setSplitTime(value[0])}
                    max={clip.duration}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="text-sm text-gray-400">
                  This will create two clips:
                  <div className="mt-1 space-y-1">
                    <div>• Part 1: 0:00 - {formatTime(splitTime)}</div>
                    <div>• Part 2: {formatTime(splitTime)} - {formatTime(clip.duration)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-700">
              <Button 
                onClick={handleApplyTrim}
                className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/80"
              >
                Apply Trim
              </Button>
              <Button 
                onClick={handleSplitClip}
                variant="outline"
                className="flex-1"
              >
                <Scissors className="w-4 h-4 mr-2" />
                Split Clip
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}