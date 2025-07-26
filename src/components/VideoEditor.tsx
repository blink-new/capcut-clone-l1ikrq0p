import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Download,
  Upload,
  Scissors,
  Layers,
  Sparkles,
  Type,
  Music,
  Settings,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { MediaLibrary } from './MediaLibrary';
import { Timeline } from './Timeline';
import { VideoPreview } from './VideoPreview';
import { EffectsPanel } from './EffectsPanel';
import { ExportModal } from './ExportModal';

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

export function VideoEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [zoom, setZoom] = useState([100]);
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activePanel, setActivePanel] = useState<'media' | 'effects' | 'audio' | 'text'>('media');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file);
          const newClip: VideoClip = {
            id: `clip-${Date.now()}-${Math.random()}`,
            name: file.name,
            url,
            duration: 0, // Will be set when video loads
            startTime: videoClips.length * 5, // Stagger clips
            endTime: videoClips.length * 5 + 5,
            track: 0
          };
          setVideoClips(prev => [...prev, newClip]);
        }
      });
    }
  }, [videoClips.length]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col bg-[#1A1A1A] text-white">
      {/* Top Navigation */}
      <div className="h-14 bg-[#0F0F0F] border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-[#FF6B35]">CapCut Clone</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/80"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Media Library & Effects */}
        <div className="w-80 bg-[#0F0F0F] border-r border-gray-800 flex flex-col">
          {/* Panel Tabs */}
          <div className="h-12 border-b border-gray-800 flex">
            {[
              { id: 'media', label: 'Media', icon: Layers },
              { id: 'effects', label: 'Effects', icon: Sparkles },
              { id: 'audio', label: 'Audio', icon: Music },
              { id: 'text', label: 'Text', icon: Type }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActivePanel(id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 text-sm font-medium transition-colors ${
                  activePanel === id 
                    ? 'bg-[#FF6B35] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activePanel === 'media' && <MediaLibrary onFileUpload={handleFileUpload} />}
            {activePanel === 'effects' && <EffectsPanel />}
            {activePanel === 'audio' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Audio Library</h3>
                <p className="text-gray-400 text-sm">Audio effects and music coming soon...</p>
              </div>
            )}
            {activePanel === 'text' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Text & Titles</h3>
                <p className="text-gray-400 text-sm">Text overlays coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <VideoPreview 
              videoRef={videoRef}
              videoClips={videoClips}
              currentTime={currentTime}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            
            {/* Playback Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-lg px-4 py-2 flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => handleSeek(Math.max(0, currentTime - 10))}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleSeek(Math.min(duration, currentTime + 10))}>
                <SkipForward className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-20"
                />
              </div>
              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-64 bg-[#0F0F0F] border-t border-gray-800">
            <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold">Timeline</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setZoom([Math.max(25, zoom[0] - 25)])}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-400">{zoom[0]}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setZoom([Math.min(400, zoom[0] + 25)])}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Scissors className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Timeline
              videoClips={videoClips}
              audioClips={audioClips}
              currentTime={currentTime}
              duration={Math.max(duration, 30)} // Minimum 30 seconds
              zoom={zoom[0]}
              selectedClip={selectedClip}
              onSeek={handleSeek}
              onClipSelect={setSelectedClip}
              onClipUpdate={(clipId, updates) => {
                setVideoClips(prev => prev.map(clip => 
                  clip.id === clipId ? { ...clip, ...updates } : clip
                ));
              }}
            />
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          videoClips={videoClips}
          audioClips={audioClips}
          duration={duration}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}