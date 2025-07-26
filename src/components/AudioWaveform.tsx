import React, { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  audioUrl: string;
  width: number;
  height: number;
  currentTime: number;
  duration: number;
  color?: string;
  backgroundColor?: string;
  onSeek?: (time: number) => void;
}

export function AudioWaveform({
  audioUrl,
  width,
  height,
  currentTime,
  duration,
  color = '#4ECDC4',
  backgroundColor = '#374151',
  onSeek
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateWaveform = async () => {
      try {
        setIsLoading(true);
        
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Fetch audio file
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // Decode audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get channel data (use first channel)
        const channelData = audioBuffer.getChannelData(0);
        
        // Generate waveform data points
        const samples = Math.min(width, 1000); // Limit samples for performance
        const blockSize = Math.floor(channelData.length / samples);
        const waveform: number[] = [];
        
        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[i * blockSize + j] || 0);
          }
          waveform.push(sum / blockSize);
        }
        
        // Normalize waveform data
        const maxAmplitude = Math.max(...waveform);
        const normalizedWaveform = waveform.map(sample => 
          maxAmplitude > 0 ? sample / maxAmplitude : 0
        );
        
        setWaveformData(normalizedWaveform);
        audioContext.close();
      } catch (error) {
        console.error('Error generating waveform:', error);
        // Generate fake waveform data as fallback
        const fakeWaveform = Array.from({ length: Math.min(width, 200) }, () => 
          Math.random() * 0.8 + 0.1
        );
        setWaveformData(fakeWaveform);
      } finally {
        setIsLoading(false);
      }
    };

    if (audioUrl) {
      generateWaveform();
    }
  }, [audioUrl, width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    const barWidth = width / waveformData.length;
    const progressPosition = duration > 0 ? (currentTime / duration) * width : 0;

    waveformData.forEach((amplitude, index) => {
      const barHeight = amplitude * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;

      // Use different colors for played and unplayed portions
      ctx.fillStyle = x < progressPosition ? color : `${color}40`;
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight);
    });

    // Draw progress line
    if (progressPosition > 0) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressPosition, 0);
      ctx.lineTo(progressPosition, height);
      ctx.stroke();
    }
  }, [waveformData, width, height, currentTime, duration, color, backgroundColor]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || duration === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickTime = (x / width) * duration;
    
    onSeek(Math.max(0, Math.min(duration, clickTime)));
  };

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-700 rounded"
        style={{ width, height }}
      >
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4ECDC4]"></div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="cursor-pointer rounded"
      onClick={handleCanvasClick}
      style={{ width, height }}
    />
  );
}

// Simplified waveform for timeline display
export function SimpleWaveform({
  width,
  height,
  color = '#4ECDC4',
  animated = false
}: {
  width: number;
  height: number;
  color?: string;
  animated?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Generate simple waveform pattern
    const bars = Math.floor(width / 3);
    const barWidth = 2;
    const spacing = 1;

    ctx.fillStyle = color;

    for (let i = 0; i < bars; i++) {
      const amplitude = Math.sin(i * 0.5) * 0.5 + 0.5; // Sine wave pattern
      const barHeight = amplitude * height * 0.8;
      const x = i * (barWidth + spacing);
      const y = (height - barHeight) / 2;

      if (animated) {
        const phase = (Date.now() * 0.005 + i * 0.2) % (Math.PI * 2);
        const animatedHeight = (Math.sin(phase) * 0.3 + 0.7) * barHeight;
        ctx.fillRect(x, (height - animatedHeight) / 2, barWidth, animatedHeight);
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="rounded"
      style={{ width, height }}
    />
  );
}