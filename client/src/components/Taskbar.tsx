import { useState, useEffect } from 'react';
import { useWindowStore } from '../lib/window';

type TaskbarProps = {
  onStartClick: () => void;
  onLogout?: () => void;
};

export default function Taskbar({ onStartClick, onLogout }: TaskbarProps) {
  const { windows, openWindow } = useWindowStore();
  const [time, setTime] = useState('00:00');
  
  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    
    // Initial update
    updateTime();
    
    // Setup interval to update time every minute
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get active windows for taskbar
  const activeWindows = Object.entries(windows)
    .filter(([_, window]) => window.isOpen)
    .map(([windowId, window]) => ({ 
      windowId, 
      title: window.title,
      icon: window.icon,
      isOpen: window.isOpen,
      isMinimized: window.isMinimized
    }));
  
  return (
    <div className="taskbar fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-2 flex items-center justify-between border-t border-gray-700">
      <div className="flex items-center space-x-2">
        <button 
          id="start-button" 
          className="flex items-center justify-center w-10 h-10 bg-primary hover:bg-blue-700 rounded-full transition-colors"
          onClick={onStartClick}
        >
          <i className="ri-code-s-slash-line text-xl"></i>
        </button>
        
        {activeWindows.length > 0 && (
          <>
            <div className="h-6 border-r border-gray-600 mx-1"></div>
            <div id="taskbar-apps" className="flex space-x-1">
              {activeWindows.map((window) => (
                <button
                  key={window.windowId}
                  className="flex items-center justify-center w-10 h-10 rounded hover:bg-white/10 transition-colors taskbar-item"
                  onClick={() => openWindow(window.windowId as any)}
                >
                  <i className={`${window.icon} text-lg`}></i>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <div id="taskbar-time" className="text-sm font-medium">{time}</div>
        <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/10 transition-colors taskbar-item">
          <i className="ri-wifi-line"></i>
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/10 transition-colors taskbar-item">
          <i className="ri-volume-up-line"></i>
        </button>
        {onLogout && (
          <button 
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-600/30 text-red-500 hover:text-red-300 transition-colors taskbar-item" 
            onClick={onLogout}
            title="Logout"
          >
            <i className="ri-shut-down-line"></i>
          </button>
        )}
      </div>
    </div>
  );
}
