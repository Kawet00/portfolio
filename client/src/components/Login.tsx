import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  
  // Update time and date every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: isLoggingIn ? 1.1 : 1, transition: { duration: 0.5 } }}
    >
      <div className="flex flex-col items-center mb-10">
        <div className="text-5xl font-light mb-2">{currentTime}</div>
        <div className="text-lg opacity-80">{currentDate}</div>
      </div>
      
      <motion.div
        className="bg-gray-800/70 backdrop-blur-md rounded-xl p-8 w-80 flex flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 flex items-center justify-center">
          <i className="ri-user-line text-4xl"></i>
        </div>
        
        <h2 className="text-xl font-medium mb-2">Kawet's Portfolio</h2>
        <p className="text-gray-400 text-sm mb-6 text-center">Click connect to explore Kawet's portfolio</p>
        
        <Button 
          className={`w-full ${isLoggingIn ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors duration-300`}
          onClick={() => {
            setIsLoggingIn(true);
            // Delay login to show animation
            setTimeout(() => {
              onLogin();
            }, 800);
          }}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <span className="flex items-center justify-center">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mr-2"
              >
                <i className="ri-check-line"></i>
              </motion.span>
              Connecting...
            </span>
          ) : "Connect"}
        </Button>
      </motion.div>
      
      <div className="fixed bottom-4 flex gap-4 text-sm text-gray-500">
        <span>Press F11 for fullscreen</span>
        <span>•</span>
        <span>Portfolio OS v1.0</span>
      </div>
    </motion.div>
  );
}