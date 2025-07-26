import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sparkles, 
  Palette, 
  Zap, 
  Sun, 
  Moon, 
  Contrast,
  Droplets,
  Wind,
  Star,
  Heart,
  Flame,
  Snowflake
} from 'lucide-react';

const effects = {
  filters: [
    { id: 'vintage', name: 'Vintage', icon: Sun, color: '#F59E0B' },
    { id: 'noir', name: 'Film Noir', icon: Moon, color: '#6B7280' },
    { id: 'vibrant', name: 'Vibrant', icon: Palette, color: '#EF4444' },
    { id: 'sepia', name: 'Sepia', icon: Sun, color: '#D97706' },
    { id: 'grayscale', name: 'Grayscale', icon: Contrast, color: '#9CA3AF' },
    { id: 'blur', name: 'Blur', icon: Droplets, color: '#3B82F6' },
  ],
  transitions: [
    { id: 'fade', name: 'Fade', icon: Wind, color: '#8B5CF6' },
    { id: 'slide', name: 'Slide', icon: Zap, color: '#06B6D4' },
    { id: 'zoom', name: 'Zoom', icon: Star, color: '#F59E0B' },
    { id: 'wipe', name: 'Wipe', icon: Wind, color: '#10B981' },
    { id: 'dissolve', name: 'Dissolve', icon: Droplets, color: '#EC4899' },
    { id: 'push', name: 'Push', icon: Zap, color: '#F97316' },
  ],
  animations: [
    { id: 'bounce', name: 'Bounce', icon: Heart, color: '#EF4444' },
    { id: 'shake', name: 'Shake', icon: Zap, color: '#F59E0B' },
    { id: 'pulse', name: 'Pulse', icon: Heart, color: '#EC4899' },
    { id: 'rotate', name: 'Rotate', icon: Star, color: '#8B5CF6' },
    { id: 'scale', name: 'Scale', icon: Sparkles, color: '#06B6D4' },
    { id: 'float', name: 'Float', icon: Wind, color: '#10B981' },
  ],
  overlays: [
    { id: 'particles', name: 'Particles', icon: Sparkles, color: '#F59E0B' },
    { id: 'fire', name: 'Fire', icon: Flame, color: '#EF4444' },
    { id: 'snow', name: 'Snow', icon: Snowflake, color: '#3B82F6' },
    { id: 'rain', name: 'Rain', icon: Droplets, color: '#06B6D4' },
    { id: 'stars', name: 'Stars', icon: Star, color: '#8B5CF6' },
    { id: 'hearts', name: 'Hearts', icon: Heart, color: '#EC4899' },
  ]
};

export function EffectsPanel() {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const renderEffectGrid = (effectList: typeof effects.filters) => (
    <div className="grid grid-cols-2 gap-3">
      {effectList.map((effect) => {
        const Icon = effect.icon;
        return (
          <Card
            key={effect.id}
            className={`bg-gray-800 border-gray-700 p-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-gray-700 ${
              selectedEffect === effect.id ? 'ring-2 ring-[#FF6B35] bg-gray-700' : ''
            }`}
            onClick={() => setSelectedEffect(effect.id)}
          >
            <div className="aspect-square bg-gray-700 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
              <Icon 
                className="w-8 h-8" 
                style={{ color: effect.color }}
              />
              <div 
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: effect.color }}
              />
            </div>
            <p className="text-xs font-medium text-center text-gray-200">
              {effect.name}
            </p>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold mb-2">Effects & Filters</h3>
        <p className="text-sm text-gray-400">
          Add visual effects to your video clips
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="filters" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 mx-4 mt-4">
            <TabsTrigger value="filters" className="text-xs">Filters</TabsTrigger>
            <TabsTrigger value="transitions" className="text-xs">Transitions</TabsTrigger>
            <TabsTrigger value="animations" className="text-xs">Animations</TabsTrigger>
            <TabsTrigger value="overlays" className="text-xs">Overlays</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="filters" className="p-4 mt-0">
              {renderEffectGrid(effects.filters)}
            </TabsContent>

            <TabsContent value="transitions" className="p-4 mt-0">
              {renderEffectGrid(effects.transitions)}
            </TabsContent>

            <TabsContent value="animations" className="p-4 mt-0">
              {renderEffectGrid(effects.animations)}
            </TabsContent>

            <TabsContent value="overlays" className="p-4 mt-0">
              {renderEffectGrid(effects.overlays)}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Effect Controls */}
      {selectedEffect && (
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Effect Settings</h4>
            <Badge variant="secondary" className="bg-[#FF6B35] text-white">
              {effects.filters.find(e => e.id === selectedEffect)?.name ||
               effects.transitions.find(e => e.id === selectedEffect)?.name ||
               effects.animations.find(e => e.id === selectedEffect)?.name ||
               effects.overlays.find(e => e.id === selectedEffect)?.name}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Intensity</label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Duration</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                defaultValue="1"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="flex space-x-2">
              <Button size="sm" className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/80">
                Apply
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}