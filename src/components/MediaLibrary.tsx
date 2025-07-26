import React, { useState, useCallback } from 'react';
import { Upload, Video, Music, Image, File, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MediaLibraryProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MediaLibrary({ onFileUpload }: MediaLibraryProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Create a synthetic event for the file upload handler
      const syntheticEvent = {
        target: { files: e.dataTransfer.files }
      } as React.ChangeEvent<HTMLInputElement>;
      onFileUpload(syntheticEvent);
    }
  }, [onFileUpload]);

  return (
    <div className="h-full flex flex-col">
      {/* Upload Area */}
      <div className="p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-[#FF6B35] bg-[#FF6B35]/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Import Media</h3>
          <p className="text-sm text-gray-400 mb-4">
            Drag and drop files here or click to browse
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'video/*,audio/*,image/*';
              input.multiple = true;
              input.onchange = onFileUpload;
              input.click();
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>

      {/* Media Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Recent Files */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Recent</h4>
            <div className="grid grid-cols-2 gap-2">
              {/* Placeholder media items */}
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-gray-800 border-gray-700 p-3 cursor-pointer hover:bg-gray-700 transition-colors">
                  <div className="aspect-video bg-gray-700 rounded mb-2 flex items-center justify-center">
                    <Video className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 truncate">Sample Video {i}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Stock Media */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Stock Media</h4>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Video className="w-4 h-4 mr-3" />
                Stock Videos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Music className="w-4 h-4 mr-3" />
                Music Library
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Image className="w-4 h-4 mr-3" />
                Stock Photos
              </Button>
            </div>
          </div>

          {/* File Types */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">File Types</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Videos</span>
                <span className="text-gray-500">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Audio</span>
                <span className="text-gray-500">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Images</span>
                <span className="text-gray-500">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}