import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Move,
  RotateCw,
  Zap,
  Sparkles
} from 'lucide-react';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  opacity: number;
  rotation: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: 'left' | 'center' | 'right';
  animation: string;
  startTime: number;
  endTime: number;
}

interface TextOverlayProps {
  textElements: TextElement[];
  onAddText: (element: Omit<TextElement, 'id'>) => void;
  onUpdateText: (id: string, updates: Partial<TextElement>) => void;
  onDeleteText: (id: string) => void;
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
}

const fontFamilies = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
  'Courier New'
];

const textAnimations = [
  { id: 'none', name: 'None' },
  { id: 'fadeIn', name: 'Fade In' },
  { id: 'slideUp', name: 'Slide Up' },
  { id: 'slideDown', name: 'Slide Down' },
  { id: 'slideLeft', name: 'Slide Left' },
  { id: 'slideRight', name: 'Slide Right' },
  { id: 'zoomIn', name: 'Zoom In' },
  { id: 'zoomOut', name: 'Zoom Out' },
  { id: 'bounce', name: 'Bounce' },
  { id: 'shake', name: 'Shake' },
  { id: 'pulse', name: 'Pulse' },
  { id: 'typewriter', name: 'Typewriter' }
];

const textPresets = [
  {
    name: 'Title',
    fontSize: 48,
    fontFamily: 'Inter',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    bold: true,
    animation: 'fadeIn'
  },
  {
    name: 'Subtitle',
    fontSize: 32,
    fontFamily: 'Inter',
    color: '#E5E7EB',
    backgroundColor: 'transparent',
    bold: false,
    animation: 'slideUp'
  },
  {
    name: 'Caption',
    fontSize: 24,
    fontFamily: 'Inter',
    color: '#9CA3AF',
    backgroundColor: 'rgba(0,0,0,0.7)',
    bold: false,
    animation: 'none'
  },
  {
    name: 'Highlight',
    fontSize: 36,
    fontFamily: 'Impact',
    color: '#FF6B35',
    backgroundColor: 'transparent',
    bold: true,
    animation: 'bounce'
  }
];

export function TextOverlay({
  textElements,
  onAddText,
  onUpdateText,
  onDeleteText,
  selectedElement,
  onSelectElement
}: TextOverlayProps) {
  const [newText, setNewText] = useState('Enter your text here');
  const [activeTab, setActiveTab] = useState('add');
  
  const selectedTextElement = textElements.find(el => el.id === selectedElement);

  const handleAddText = (preset?: typeof textPresets[0]) => {
    const newElement: Omit<TextElement, 'id'> = {
      text: newText,
      x: 50, // Center position (percentage)
      y: 50,
      fontSize: preset?.fontSize || 32,
      fontFamily: preset?.fontFamily || 'Inter',
      color: preset?.color || '#FFFFFF',
      backgroundColor: preset?.backgroundColor || 'transparent',
      opacity: 100,
      rotation: 0,
      bold: preset?.bold || false,
      italic: false,
      underline: false,
      alignment: 'center',
      animation: preset?.animation || 'none',
      startTime: 0,
      endTime: 5
    };
    
    onAddText(newElement);
    setActiveTab('edit');
  };

  const updateSelectedElement = (updates: Partial<TextElement>) => {
    if (selectedElement) {
      onUpdateText(selectedElement, updates);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold mb-2">Text & Titles</h3>
        <p className="text-sm text-gray-400">
          Add text overlays and animated titles to your video
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 mx-4 mt-4">
            <TabsTrigger value="add" className="text-xs">Add Text</TabsTrigger>
            <TabsTrigger value="edit" className="text-xs">Edit</TabsTrigger>
            <TabsTrigger value="animate" className="text-xs">Animate</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Add Text Tab */}
            <TabsContent value="add" className="p-4 mt-0 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Text Content</label>
                <Textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter your text here..."
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Quick Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {textPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start"
                      onClick={() => handleAddText(preset)}
                    >
                      <span className="font-medium text-sm">{preset.name}</span>
                      <span className="text-xs text-gray-400">
                        {preset.fontSize}px • {preset.animation}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => handleAddText()}
                className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/80"
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text
              </Button>
            </TabsContent>

            {/* Edit Text Tab */}
            <TabsContent value="edit" className="p-4 mt-0 space-y-4">
              {selectedTextElement ? (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Text Content</label>
                    <Textarea
                      value={selectedTextElement.text}
                      onChange={(e) => updateSelectedElement({ text: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Font Size</label>
                      <Slider
                        value={[selectedTextElement.fontSize]}
                        onValueChange={(value) => updateSelectedElement({ fontSize: value[0] })}
                        min={12}
                        max={120}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{selectedTextElement.fontSize}px</span>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Opacity</label>
                      <Slider
                        value={[selectedTextElement.opacity]}
                        onValueChange={(value) => updateSelectedElement({ opacity: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{selectedTextElement.opacity}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Font Family</label>
                    <select
                      value={selectedTextElement.fontFamily}
                      onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                    >
                      {fontFamilies.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Text Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={selectedTextElement.color}
                          onChange={(e) => updateSelectedElement({ color: e.target.value })}
                          className="w-8 h-8 rounded border border-gray-700"
                        />
                        <Input
                          value={selectedTextElement.color}
                          onChange={(e) => updateSelectedElement({ color: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Background</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={selectedTextElement.backgroundColor === 'transparent' ? '#000000' : selectedTextElement.backgroundColor}
                          onChange={(e) => updateSelectedElement({ backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded border border-gray-700"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSelectedElement({ backgroundColor: 'transparent' })}
                          className="text-xs"
                        >
                          None
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Text Formatting */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Formatting</label>
                    <div className="flex space-x-2">
                      <Button
                        variant={selectedTextElement.bold ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSelectedElement({ bold: !selectedTextElement.bold })}
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={selectedTextElement.italic ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSelectedElement({ italic: !selectedTextElement.italic })}
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={selectedTextElement.underline ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSelectedElement({ underline: !selectedTextElement.underline })}
                      >
                        <Underline className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Alignment</label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'left', icon: AlignLeft },
                        { value: 'center', icon: AlignCenter },
                        { value: 'right', icon: AlignRight }
                      ].map(({ value, icon: Icon }) => (
                        <Button
                          key={value}
                          variant={selectedTextElement.alignment === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSelectedElement({ alignment: value as any })}
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Position and Rotation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Rotation</label>
                      <Slider
                        value={[selectedTextElement.rotation]}
                        onValueChange={(value) => updateSelectedElement({ rotation: value[0] })}
                        min={-180}
                        max={180}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{selectedTextElement.rotation}°</span>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Duration</label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={selectedTextElement.startTime}
                          onChange={(e) => updateSelectedElement({ startTime: parseFloat(e.target.value) })}
                          className="bg-gray-800 border-gray-700 text-xs"
                          step="0.1"
                        />
                        <Input
                          type="number"
                          value={selectedTextElement.endTime}
                          onChange={(e) => updateSelectedElement({ endTime: parseFloat(e.target.value) })}
                          className="bg-gray-800 border-gray-700 text-xs"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDeleteText(selectedTextElement.id);
                      onSelectElement(null);
                    }}
                    className="w-full"
                  >
                    Delete Text
                  </Button>
                </>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Type className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a text element to edit</p>
                </div>
              )}
            </TabsContent>

            {/* Animate Tab */}
            <TabsContent value="animate" className="p-4 mt-0 space-y-4">
              {selectedTextElement ? (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Animation Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {textAnimations.map((animation) => (
                        <Button
                          key={animation.id}
                          variant={selectedTextElement.animation === animation.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSelectedElement({ animation: animation.id })}
                          className="justify-start"
                        >
                          {animation.id === 'none' ? (
                            <span className="w-4 h-4 mr-2" />
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          {animation.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Animation Preview</h4>
                    <div className="bg-black rounded p-4 text-center">
                      <div
                        className={`inline-block text-white transition-all duration-1000 ${
                          selectedTextElement.animation === 'bounce' ? 'animate-bounce' :
                          selectedTextElement.animation === 'pulse' ? 'animate-pulse' :
                          selectedTextElement.animation === 'shake' ? 'animate-pulse' : ''
                        }`}
                        style={{
                          fontSize: `${Math.min(selectedTextElement.fontSize / 2, 24)}px`,
                          color: selectedTextElement.color,
                          fontFamily: selectedTextElement.fontFamily,
                          fontWeight: selectedTextElement.bold ? 'bold' : 'normal',
                          fontStyle: selectedTextElement.italic ? 'italic' : 'normal',
                          textDecoration: selectedTextElement.underline ? 'underline' : 'none',
                          textAlign: selectedTextElement.alignment,
                          transform: `rotate(${selectedTextElement.rotation}deg)`,
                          opacity: selectedTextElement.opacity / 100
                        }}
                      >
                        {selectedTextElement.text}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a text element to animate</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Text Elements List */}
      {textElements.length > 0 && (
        <div className="border-t border-gray-800 p-4">
          <h4 className="font-medium mb-2">Text Elements</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {textElements.map((element) => (
              <div
                key={element.id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  selectedElement === element.id 
                    ? 'bg-[#FF6B35] text-white' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => onSelectElement(element.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">
                    {element.text.substring(0, 20)}...
                  </span>
                  <span className="text-xs opacity-75">
                    {element.startTime}s - {element.endTime}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}