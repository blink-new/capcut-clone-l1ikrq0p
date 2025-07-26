import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Download, 
  Settings, 
  Video, 
  Smartphone, 
  Monitor, 
  Tv,
  X,
  Check
} from 'lucide-react';

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

interface ExportModalProps {
  videoClips: VideoClip[];
  audioClips: AudioClip[];
  duration: number;
  onClose: () => void;
}

const exportPresets = [
  {
    id: 'hd',
    name: 'HD 1080p',
    description: 'High quality for social media',
    resolution: '1920×1080',
    fps: 30,
    bitrate: '8 Mbps',
    icon: Monitor,
    recommended: true
  },
  {
    id: 'mobile',
    name: 'Mobile Optimized',
    description: 'Perfect for phones and tablets',
    resolution: '1080×1920',
    fps: 30,
    bitrate: '5 Mbps',
    icon: Smartphone,
    recommended: false
  },
  {
    id: '4k',
    name: '4K Ultra HD',
    description: 'Maximum quality',
    resolution: '3840×2160',
    fps: 30,
    bitrate: '20 Mbps',
    icon: Tv,
    recommended: false
  },
  {
    id: 'web',
    name: 'Web Optimized',
    description: 'Smaller file size',
    resolution: '1280×720',
    fps: 30,
    bitrate: '3 Mbps',
    icon: Video,
    recommended: false
  }
];

export function ExportModal({ videoClips, audioClips, duration, onClose }: ExportModalProps) {
  const [selectedPreset, setSelectedPreset] = useState('hd');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const selectedPresetData = exportPresets.find(p => p.id === selectedPreset);
  const estimatedSize = Math.round((duration * 8 * 1024) / 8); // Rough estimate in KB

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1A1A1A] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#FF6B35]">
            Export Video
          </DialogTitle>
        </DialogHeader>

        {!exportComplete ? (
          <div className="space-y-6">
            {/* Export Presets */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Export Quality</h3>
              <div className="grid grid-cols-2 gap-3">
                {exportPresets.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <Card
                      key={preset.id}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        selectedPreset === preset.id
                          ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedPreset(preset.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="w-6 h-6 text-[#4ECDC4] mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{preset.name}</h4>
                            {preset.recommended && (
                              <Badge className="bg-[#FF6B35] text-white text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            {preset.description}
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Resolution: {preset.resolution}</div>
                            <div>Frame Rate: {preset.fps} FPS</div>
                            <div>Bitrate: {preset.bitrate}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-gray-800" />

            {/* Export Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Video Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Video Clips:</span>
                    <span>{videoClips.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Audio Clips:</span>
                    <span>{audioClips.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Size:</span>
                    <span>{estimatedSize > 1024 ? `${(estimatedSize / 1024).toFixed(1)} MB` : `${estimatedSize} KB`}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Export Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Format:</span>
                    <span>MP4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Codec:</span>
                    <span>H.264</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Audio:</span>
                    <span>AAC 128kbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality:</span>
                    <span>{selectedPresetData?.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Exporting Video...</span>
                  <span className="text-sm text-gray-400">{Math.round(exportProgress)}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
                <p className="text-sm text-gray-400">
                  This may take a few minutes depending on your video length and quality settings.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Export Complete */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Export Complete!</h3>
            <p className="text-gray-400 mb-6">
              Your video has been successfully exported and is ready for download.
            </p>
            <Button 
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/80"
              onClick={() => {
                // In a real app, this would trigger the download
                console.log('Downloading video...');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
          </div>
        )}

        <DialogFooter>
          {!exportComplete && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isExporting}>
                Cancel
              </Button>
              <Button 
                className="bg-[#FF6B35] hover:bg-[#FF6B35]/80"
                onClick={handleExport}
                disabled={isExporting || videoClips.length === 0}
              >
                {isExporting ? (
                  <>
                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Start Export
                  </>
                )}
              </Button>
            </>
          )}
          {exportComplete && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}