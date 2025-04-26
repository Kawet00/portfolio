import React from 'react';

type WindowHeaderProps = {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  className?: string;
};

export default function WindowHeader({ 
  title, 
  onClose, 
  onMinimize, 
  onMaximize, 
  isMaximized,
  className = 'bg-gray-700' 
}: WindowHeaderProps) {
  return (
    <div className={`window-header ${className} p-3 flex items-center justify-between cursor-grab active:cursor-grabbing`}>
      <div className="flex items-center space-x-2">
        <div 
          className="w-3 h-3 rounded-full bg-red-500 cursor-pointer window-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        ></div>
        <div 
          className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer window-minimize"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
        ></div>
        <div 
          className="w-3 h-3 rounded-full bg-green-500 cursor-pointer window-maximize"
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
        ></div>
      </div>
      <div className="text-sm font-medium">{title}</div>
      <div className="w-5"></div>
    </div>
  );
}
