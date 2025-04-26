import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/components/Login";

function Router({ onLogout }: { onLogout: () => void }) {
  return (
    <Switch>
      <Route path="/">
        <Home onLogout={onLogout} />
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // We're not checking local storage to ensure users need to reconnect
  // after page refresh - uncomment this if you want persistence
  /*
  useEffect(() => {
    const loginStatus = localStorage.getItem('portfolio-logged-in');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  */
  
  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('portfolio-logged-in', 'true');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('portfolio-logged-in');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <Login key="login" onLogin={handleLogin} />
          ) : (
            <motion.div 
              key="desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Router onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
