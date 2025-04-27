import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  useSettingsStore, 
  ThemeColor,
  WallpaperStyle,
  CursorStyle,
} from '@/lib/settings';

export default function SettingsWindow() {
  const { 
    themeColor, 
    wallpaperStyle, 
    cursorStyle,
    showClock,
    setThemeColor,
    setWallpaperStyle,
    setCursorStyle,
    toggleClock,
  } = useSettingsStore();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      
      <Tabs defaultValue="appearance">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="desktop">Desktop</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Theme Color</h3>
            <RadioGroup 
              value={themeColor} 
              onValueChange={(value) => setThemeColor(value as ThemeColor)}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blue" id="blue" className="sr-only" />
                <Label 
                  htmlFor="blue" 
                  className={`w-8 h-8 rounded-full bg-blue-600 cursor-pointer ring-offset-2 ${themeColor === 'blue' ? 'ring-2 ring-blue-600' : ''}`}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="purple" id="purple" className="sr-only" />
                <Label 
                  htmlFor="purple" 
                  className={`w-8 h-8 rounded-full bg-purple-600 cursor-pointer ring-offset-2 ${themeColor === 'purple' ? 'ring-2 ring-purple-600' : ''}`}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="green" id="green" className="sr-only" />
                <Label 
                  htmlFor="green" 
                  className={`w-8 h-8 rounded-full bg-green-600 cursor-pointer ring-offset-2 ${themeColor === 'green' ? 'ring-2 ring-green-600' : ''}`}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orange" id="orange" className="sr-only" />
                <Label 
                  htmlFor="orange" 
                  className={`w-8 h-8 rounded-full bg-orange-600 cursor-pointer ring-offset-2 ${themeColor === 'orange' ? 'ring-2 ring-orange-600' : ''}`}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="red" id="red" className="sr-only" />
                <Label 
                  htmlFor="red" 
                  className={`w-8 h-8 rounded-full bg-red-600 cursor-pointer ring-offset-2 ${themeColor === 'red' ? 'ring-2 ring-red-600' : ''}`}
                />
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Wallpaper Style</h3>
            <RadioGroup 
              value={wallpaperStyle} 
              onValueChange={(value) => setWallpaperStyle(value as WallpaperStyle)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gradient" id="gradient" />
                <Label htmlFor="gradient">Gradient</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solid" id="solid" />
                <Label htmlFor="solid">Solid Color</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image">Image (Coming Soon)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Cursor Style</h3>
            <RadioGroup 
              value={cursorStyle} 
              onValueChange={(value) => setCursorStyle(value as CursorStyle)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="cursor-default" />
                <Label htmlFor="cursor-default">Default</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pointer" id="cursor-pointer" />
                <Label htmlFor="cursor-pointer">Pointer</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mac" id="cursor-mac" />
                <Label htmlFor="cursor-mac">Mac Style</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="windows98" id="cursor-win98" />
                <Label htmlFor="cursor-win98">Windows 98</Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
        
        <TabsContent value="desktop" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Show Clock</h3>
              <p className="text-sm text-gray-400">Display time in the taskbar</p>
            </div>
            <Switch 
              checked={showClock} 
              onCheckedChange={toggleClock}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Desktop Icons</h3>
              <p className="text-sm text-gray-400">Drag and drop to rearrange (enabled by default)</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-md">
            <h3 className="text-lg font-medium">About</h3>
            <p className="text-sm text-gray-400 mt-2">Portfolio OS v1.0</p>
            <p className="text-sm text-gray-400">© 2025 Kawet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}