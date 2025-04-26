import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useWindowStore, WindowId } from '../lib/window';

type DesktopIconProps = {
  id: WindowId;
  label: string;
  icon: string;
  className?: string;
  index?: number;
};

// Load icon positions from localStorage or use default positions
const loadIconPosition = (id: WindowId) => {
  try {
    const saved = localStorage.getItem(`icon-position-${id}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading icon position", e);
  }
  return { x: 0, y: 0 };
};

// Save icon position to localStorage
const saveIconPosition = (id: WindowId, position: { x: number, y: number }) => {
  try {
    localStorage.setItem(`icon-position-${id}`, JSON.stringify(position));
  } catch (e) {
    console.error("Error saving icon position", e);
  }
};

export default function DesktopIcon({ id, label, icon, className = '', index = 0 }: DesktopIconProps) {
  const openWindow = useWindowStore(state => state.openWindow);
  const iconRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  // Use Framer Motion's useMotionValue for smooth tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  
  // Load saved position on mount
  useEffect(() => {
    const savedPosition = loadIconPosition(id);
    x.set(savedPosition.x);
    y.set(savedPosition.y);
  }, [id]);
  
  // Handle icon click
  const handleClick = () => {
    if (!isDragging) {
      openWindow(id);
    }
  };
  
  // Track drag start
  const handleDragStart = () => {
    setIsDragging(true);
    dragStartPosition.current = { x: x.get(), y: y.get() };
  };
  
  // Handle drag end and save position
  const handleDragEnd = () => {
    const currentX = x.get();
    const currentY = y.get();
    
    // Calculate distance moved
    const distance = Math.sqrt(
      Math.pow(currentX - dragStartPosition.current.x, 2) + 
      Math.pow(currentY - dragStartPosition.current.y, 2)
    );
    
    // If we barely moved, consider it a click
    if (distance < 5) {
      openWindow(id);
    }
    
    // Save the final position
    saveIconPosition(id, { x: currentX, y: currentY });
    
    // Reset drag state after a short delay
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };
  
  return (
    <div ref={constraintsRef} style={{ position: 'relative', height: '100%', width: '100%' }}>
      <motion.div 
        ref={iconRef}
        className="desktop-icon text-center cursor-grab active:cursor-grabbing z-10"
        drag
        dragMomentum={false}
        dragConstraints={{
          left: -100, 
          right: window.innerWidth - 150,
          top: 0, 
          bottom: window.innerHeight - 280
        }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        style={{ 
          position: 'absolute',
          x, y
        }}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileDrag={{ scale: 1.05, opacity: 0.8 }}
      >
        <div className={`w-16 h-16 mx-auto flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 hover:shadow-lg transition-all duration-300 ${className}`}>
          <i className={`${icon} text-3xl`}></i>
        </div>
        <p className="mt-1 text-xs font-medium text-white text-shadow">{label}</p>
      </motion.div>
    </div>
  );
}
