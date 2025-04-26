import { useEffect, useState } from 'react';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import { AnimatePresence } from 'framer-motion';
import { useWindowStore, WindowId } from '../lib/window';
import { useEasterEggStore, attachKonamiCodeListener } from '../lib/easterEggs';
import { useSettingsStore, getWallpaperClass, getCursorClass, initializeCustomCursors } from '../lib/settings';

// Import all window contents
import AboutWindow from './windows/AboutWindow';
import ProjectsWindow from './windows/ProjectsWindow';
import TerminalWindow from './windows/Terminal';
import ContactWindow from './windows/ContactWindow';
import SkillsWindow from './windows/SkillsWindow';
import TrashWindow from './windows/TrashWindow';
import EasterEggWindow from './windows/EasterEggWindow';
import SecretProjectWindow from './windows/SecretProjectWindow';
import SettingsWindow from './windows/SettingsWindow';

interface DesktopProps {
  onLogout?: () => void;
}

export default function Desktop({ onLogout }: DesktopProps) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const { isEasterEggIconVisible, isKonamiActive } = useEasterEggStore();
  const { themeColor, wallpaperStyle, cursorStyle } = useSettingsStore();
  
  // Get wallpaper class based on selected theme
  const wallpaperClass = getWallpaperClass(wallpaperStyle, themeColor);
  const cursorClass = getCursorClass(cursorStyle);
  
  useEffect(() => {
    // Attach the konami code listener
    attachKonamiCodeListener();
    
    // Initialize custom cursors
    initializeCustomCursors();
  }, []);

  const toggleStartMenu = () => {
    setIsStartMenuOpen(prev => !prev);
  };

  const closeStartMenu = () => {
    setIsStartMenuOpen(false);
  };

  // Handle clicks outside the start menu to close it
  const handleDesktopClick = (e: React.MouseEvent) => {
    // If we're clicking on the start button, let the toggle function handle it
    if ((e.target as HTMLElement).closest('#start-button')) return;
    
    closeStartMenu();
  };

  return (
    <div 
      id="desktop" 
      className={`relative w-full h-screen p-6 overflow-hidden ${wallpaperClass} text-white ${cursorClass} ${isKonamiActive ? 'konami-active' : ''}`}
      onClick={handleDesktopClick}
    >
      {/* Desktop Icons */}
      <div className="desktop-icons grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-6 mt-4">
        <DesktopIcon id="about" label="About Me" icon="ri-user-line" />
        <DesktopIcon id="projects" label="Projects" icon="ri-folder-line" />
        <DesktopIcon id="terminal" label="Terminal" icon="ri-terminal-box-line" />
        <DesktopIcon id="contact" label="Contact" icon="ri-mail-line" />
        <DesktopIcon id="skills" label="Skills" icon="ri-code-s-slash-line" />
        <DesktopIcon id="settings" label="Settings" icon="ri-settings-line" />
        <DesktopIcon id="trash" label="Trash" icon="ri-delete-bin-line" />
        
        {/* Easter Egg Icon - hidden by default */}
        {isEasterEggIconVisible && (
          <DesktopIcon 
            id="easter-egg" 
            label="Secret" 
            icon="ri-egg-line" 
            className="text-yellow-300 animate-bounce-subtle"
          />
        )}
      </div>

      {/* All application windows */}
      <Window id="about" className="max-w-2xl">
        <AboutWindow />
      </Window>
      
      <Window id="projects" className="max-w-4xl">
        <ProjectsWindow />
      </Window>
      
      <Window id="terminal" className="max-w-2xl">
        <TerminalWindow />
      </Window>
      
      <Window id="contact" className="max-w-xl">
        <ContactWindow />
      </Window>
      
      <Window id="skills" className="max-w-2xl">
        <SkillsWindow />
      </Window>
      
      <Window id="trash" className="max-w-md">
        <TrashWindow />
      </Window>
      
      <Window id="easter-egg" className="max-w-md" headerClassName="bg-purple-900">
        <EasterEggWindow />
      </Window>
      
      <Window id="secret-project" className="max-w-md">
        <SecretProjectWindow />
      </Window>
      
      <Window id="settings" className="max-w-md">
        <SettingsWindow />
      </Window>

      {/* Taskbar */}
      <Taskbar onStartClick={toggleStartMenu} onLogout={onLogout} />

      {/* Start Menu */}
      {isStartMenuOpen && (
        <StartMenu onItemClick={closeStartMenu} onLogout={onLogout} />
      )}
    </div>
  );
}
