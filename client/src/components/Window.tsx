import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useWindowStore, WindowId } from '../lib/window';
import WindowHeader from './WindowHeader';
import { useEasterEggStore } from '../lib/easterEggs';

type WindowProps = {
  id: WindowId;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
};

export default function Window({ id, children, className = '', headerClassName = 'bg-gray-700' }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  
  const {
    windows,
    isWindowOpen,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    bringToFront,
    updatePosition,
  } = useWindowStore();
  
  const { isKonamiActive } = useEasterEggStore();
  
  const windowState = windows[id];
  const isOpen = isWindowOpen(id);

  // Update drag constraints based on window size and viewport dimensions
  useEffect(() => {
    if (windowRef.current && typeof document !== 'undefined') {
      const { clientWidth } = windowRef.current;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      
      // Set very loose constraints that just prevent windows from completely disappearing
      // This allows for much more free movement while ensuring windows remain accessible
      setDragConstraints({
        top: -(windowRef.current.clientHeight) + 30, // Keep just the title bar visible at top
        right: viewportWidth - 50, // Keep a small part visible from right
        bottom: viewportHeight - 30, // Keep a small part visible from bottom
        left: -(clientWidth - 50), // Keep a small part visible from left
      });
    }
  }, [isOpen]);

  // Handle clicks to bring window to front
  const handleWindowClick = () => {
    bringToFront(id);
  };

  // Motion values for better tracking
  const x = useMotionValue(windowState?.position.x || 0);
  const y = useMotionValue(windowState?.position.y || 0);
  
  // Track drag position for better constraints
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  
  // Handle drag start to remember initial position
  const handleDragStart = () => {
    setDragStartPos({ x: x.get(), y: y.get() });
  };
  
  // Handle drag end with improved constraints and physics
  const handleDragEnd = (_e: MouseEvent, info: { point: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    // Get viewport dimensions for constraints
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    // Calculate window dimensions
    const windowWidth = windowRef.current?.offsetWidth || 300;
    const windowHeight = windowRef.current?.offsetHeight || 200;
    
    // Calculate minimum positions to ensure windows stay partially visible
    const minX = -windowWidth + 100; // Keep at least 100px visible from left
    const maxX = viewportWidth - 100; // Keep at least 100px visible from right
    const minY = 0; // Don't allow windows to go above the viewport
    const maxY = viewportHeight - 40; // Keep at least the title bar visible
    
    // Calculate new position with momentum effect
    let newX = info.point.x + (info.velocity.x * 0.2);
    let newY = info.point.y + (info.velocity.y * 0.2);
    
    // Ensure windows stay within constraints
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    // Update the window position
    updatePosition(id, { x: newX, y: newY });
    
    // Update motion values
    x.set(newX);
    y.set(newY);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={windowRef}
      className={`window absolute bg-gray-800/90 rounded-lg overflow-hidden ${className} ${isKonamiActive ? 'konami-active' : ''}`}
      onClick={handleWindowClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: windowState.isMaximized ? '100%' : 'auto',
        height: windowState.isMaximized ? 'calc(100vh - 40px)' : 'auto',
        top: windowState.isMaximized ? 0 : windowState.position.y,
        left: windowState.isMaximized ? 0 : windowState.position.x,
        transition: { duration: 0.2 }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ 
        zIndex: windowState.zIndex,
      }}
      drag={!windowState.isMaximized}
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      dragMomentum={true}
      dragTransition={{ 
        bounceStiffness: 400, 
        bounceDamping: 20,
        power: 0.2
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-window-id={id}
    >
      <WindowHeader 
        title={window.title}
        onClose={() => closeWindow(id)}
        onMinimize={() => minimizeWindow(id)}
        onMaximize={() => window.isMaximized ? restoreWindow(id) : maximizeWindow(id)}
        isMaximized={window.isMaximized}
        className={headerClassName}
      />
      
      <div className="window-content p-6 max-h-[70vh] overflow-y-auto">
        {children}
      </div>
    </motion.div>
  );
}
