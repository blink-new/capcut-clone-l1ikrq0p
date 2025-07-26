import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
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
  Snowflake,
  Eye,
  Layers,
  Wand2,
  Camera,
  Film,
  Aperture,
  Focus,
  Lightbulb,
  Rainbow,
  Waves,
  Hexagon,
  Triangle,
  Circle,
  Square
} from 'lucide-react';

const advancedEffects = {
  colorGrading: [
    { id: 'cinematic', name: 'Cinematic', icon: Film, color: '#8B5CF6', description: 'Professional film look' },
    { id: 'vintage', name: 'Vintage Film', icon: Camera, color: '#F59E0B', description: 'Classic film grain' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: Zap, color: '#EC4899', description: 'Neon futuristic style' },
    { id: 'golden-hour', name: 'Golden Hour', icon: Sun, color: '#F59E0B', description: 'Warm sunset tones' },
    { id: 'blue-hour', name: 'Blue Hour', icon: Moon, color: '#3B82F6', description: 'Cool twilight mood' },
    { id: 'noir', name: 'Film Noir', icon: Contrast, color: '#6B7280', description: 'High contrast B&W' },
    { id: 'pastel', name: 'Pastel Dream', icon: Rainbow, color: '#EC4899', description: 'Soft pastel colors' },
    { id: 'teal-orange', name: 'Teal & Orange', icon: Palette, color: '#06B6D4', description: 'Hollywood blockbuster' }
  ],
  visualEffects: [
    { id: 'lens-flare', name: 'Lens Flare', icon: Sun, color: '#F59E0B', description: 'Realistic light flares' },
    { id: 'light-leaks', name: 'Light Leaks', icon: Lightbulb, color: '#FDE047', description: 'Vintage light leaks' },
    { id: 'film-grain', name: 'Film Grain', icon: Aperture, color: '#9CA3AF', description: 'Authentic film texture' },
    { id: 'vignette', name: 'Vignette', icon: Focus, color: '#374151', description: 'Dark edge fade' },
    { id: 'chromatic', name: 'Chromatic Aberration', icon: Eye, color: '#EC4899', description: 'Color separation' },
    { id: 'glitch', name: 'Digital Glitch', icon: Zap, color: '#EF4444', description: 'Digital distortion' },
    { id: 'hologram', name: 'Hologram', icon: Hexagon, color: '#06B6D4', description: 'Futuristic hologram' },
    { id: 'double-exposure', name: 'Double Exposure', icon: Layers, color: '#8B5CF6', description: 'Artistic overlay' }
  ],
  transitions: [
    { id: 'morph', name: 'Morph', icon: Wand2, color: '#8B5CF6', description: 'Smooth shape transition' },
    { id: 'liquid', name: 'Liquid', icon: Droplets, color: '#06B6D4', description: 'Fluid motion' },
    { id: 'shatter', name: 'Shatter', icon: Star, color: '#EF4444', description: 'Glass break effect' },
    { id: 'origami', name: 'Origami', icon: Triangle, color: '#F59E0B', description: 'Paper fold transition' },
    { id: 'kaleidoscope', name: 'Kaleidoscope', icon: Hexagon, color: '#EC4899', description: 'Geometric patterns' },
    { id: 'ripple', name: 'Ripple', icon: Waves, color: '#3B82F6', description: 'Water ripple effect' },
    { id: 'cube-flip', name: 'Cube Flip', icon: Square, color: '#10B981', description: '3D cube rotation' },
    { id: 'spiral', name: 'Spiral', icon: Circle, color: '#F97316', description: 'Spiral wipe' }
  ],
  particleEffects: [
    { id: 'sparkles', name: 'Magic Sparkles', icon: Sparkles, color: '#FDE047', description: 'Magical particles' },
    { id: 'fire', name: 'Fire Particles', icon: Flame, color: '#EF4444', description: 'Realistic fire' },
    { id: 'snow', name: 'Snow Fall', icon: Snowflake, color: '#E5E7EB', description: 'Gentle snowfall' },
    { id: 'rain', name: 'Rain Drops', icon: Droplets, color: '#3B82F6', description: 'Heavy rainfall' },
    { id: 'stars', name: 'Starfield', icon: Star, color: '#FDE047', description: 'Space stars' },
    { id: 'hearts', name: 'Floating Hearts', icon: Heart, color: '#EC4899', description: 'Love particles' },
    { id: 'bubbles', name: 'Soap Bubbles', icon: Circle, color: '#06B6D4', description: 'Floating bubbles' },
    { id: 'leaves', name: 'Falling Leaves', icon: Wind, color: '#10B981', description: 'Autumn leaves' }
  ]
};

interface EffectSettings {
  intensity: number;
  duration: number;
  delay: number;
  easing: string;
  customParams: Record<string, number>;
}

export function AdvancedEffects() {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [effectSettings, setEffectSettings] = useState<EffectSettings>({
    intensity: 50,
    duration: 1,
    delay: 0,
    easing: 'ease-in-out',
    customParams: {}
  });

  const renderEffectGrid = (effectList: typeof advancedEffects.colorGrading) => (
    <div className="grid grid-cols-1 gap-3">
      {effectList.map((effect) => {
        const Icon = effect.icon;
        return (
          <Card
            key={effect.id}
            className={`bg-gray-800 border-gray-700 p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:bg-gray-700 ${
              selectedEffect === effect.id ? 'ring-2 ring-[#FF6B35] bg-gray-700' : ''
            }`}
            onClick={() => setSelectedEffect(effect.id)}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${effect.color}20` }}
              >
                <Icon 
                  className="w-6 h-6" 
                  style={{ color: effect.color }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{effect.name}</h4>
                <p className="text-xs text-gray-400">{effect.description}</p>
              </div>
              {selectedEffect === effect.id && (
                <Badge className="bg-[#FF6B35] text-white">
                  Active
                </Badge>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );

  const getEffectCustomControls = (effectId: string) => {
    switch (effectId) {
      case 'lens-flare':
        return (
          <>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Brightness</label>
              <Slider
                value={[effectSettings.customParams.brightness || 80]}
                onValueChange={(value) => setEffectSettings(prev => ({
                  ...prev,
                  customParams: { ...prev.customParams, brightness: value[0] }
                }))}
                min={0}
                max={100}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Size</label>
              <Slider
                value={[effectSettings.customParams.size || 50]}
                onValueChange={(value) => setEffectSettings(prev => ({
                  ...prev,
                  customParams: { ...prev.customParams, size: value[0] }
                }))}
                min={10}
                max={200}
                className="w-full"
              />
            </div>
          </>
        );
      case 'film-grain':
        return (
          <>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Grain Size</label>
              <Slider
                value={[effectSettings.customParams.grainSize || 30]}
                onValueChange={(value) => setEffectSettings(prev => ({
                  ...prev,
                  customParams: { ...prev.customParams, grainSize: value[0] }
                }))}
                min={1}
                max={100}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Contrast</label>
              <Slider
                value={[effectSettings.customParams.contrast || 60]}
                onValueChange={(value) => setEffectSettings(prev => ({
                  ...prev,
                  customParams: { ...prev.customParams, contrast: value[0] }
                }))}
                min={0}
                max={100}
                className="w-full"
              />
            </div>
          </>
        );
      case 'glitch':
        return (
          <>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Frequency</label>
              <Slider
                value={[effectSettings.customParams.frequency || 40]}
                onValueChange={(value) => setEffectSettings(prev => ({
                  ...prev,
                  customParams: { ...prev.customParams, frequency: value[0] }
                }))}
                min={1}
                max={100}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Distortion</label>
              <Slider
                value={[effectSettings.customParams.distortion || 70]}
                onValueChange={(value) => setEffectSettings(prev => ({
                  ...prev,
                  customParams: { ...prev.customParams, distortion: value[0] }
                }))}
                min={0}
                max={100}
                className="w-full"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold mb-2">Advanced Effects</h3>
        <p className="text-sm text-gray-400">
          Professional-grade visual effects and transitions
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="color" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 mx-4 mt-4">
            <TabsTrigger value="color" className="text-xs">Color</TabsTrigger>
            <TabsTrigger value="visual" className="text-xs">Visual FX</TabsTrigger>
            <TabsTrigger value="transitions" className="text-xs">Transitions</TabsTrigger>
            <TabsTrigger value="particles" className="text-xs">Particles</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="color" className="p-4 mt-0">
              {renderEffectGrid(advancedEffects.colorGrading)}
            </TabsContent>

            <TabsContent value="visual" className="p-4 mt-0">
              {renderEffectGrid(advancedEffects.visualEffects)}
            </TabsContent>

            <TabsContent value="transitions" className="p-4 mt-0">
              {renderEffectGrid(advancedEffects.transitions)}
            </TabsContent>

            <TabsContent value="particles" className="p-4 mt-0">
              {renderEffectGrid(advancedEffects.particleEffects)}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Advanced Effect Controls */}
      {selectedEffect && (
        <div className="border-t border-gray-800 p-4 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Effect Settings</h4>
            <Badge variant="secondary" className="bg-[#FF6B35] text-white">
              {Object.values(advancedEffects).flat().find(e => e.id === selectedEffect)?.name}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {/* Basic Controls */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Intensity</label>
              <Slider
                value={[effectSettings.intensity]}
                onValueChange={(value) => setEffectSettings(prev => ({ ...prev, intensity: value[0] }))}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{effectSettings.intensity}%</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Duration</label>
                <Slider
                  value={[effectSettings.duration]}
                  onValueChange={(value) => setEffectSettings(prev => ({ ...prev, duration: value[0] }))}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{effectSettings.duration}s</span>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Delay</label>
                <Slider
                  value={[effectSettings.delay]}
                  onValueChange={(value) => setEffectSettings(prev => ({ ...prev, delay: value[0] }))}
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{effectSettings.delay}s</span>
              </div>
            </div>

            {/* Easing */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Animation Easing</label>
              <select
                value={effectSettings.easing}
                onChange={(e) => setEffectSettings(prev => ({ ...prev, easing: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
              >
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="bounce">Bounce</option>
                <option value="elastic">Elastic</option>
              </select>
            </div>

            {/* Custom Effect Controls */}
            {getEffectCustomControls(selectedEffect)}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button size="sm" className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/80">
                Apply Effect
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Preview
              </Button>
              <Button size="sm" variant="ghost">
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}