import { useWindowStore, WindowId } from '../lib/window';

type StartMenuProps = {
  onItemClick: () => void;
  onLogout?: () => void;
};

export default function StartMenu({ onItemClick, onLogout }: StartMenuProps) {
  const openWindow = useWindowStore(state => state.openWindow);
  
  const handleAppClick = (id: WindowId) => {
    openWindow(id);
    onItemClick();
  };
  
  return (
    <div id="start-menu" className="fixed bottom-12 left-2 w-64 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 p-4 z-50">
      <div className="flex items-center mb-4 pb-2 border-b border-gray-700">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
          <i className="ri-user-line text-xl"></i>
        </div>
        <div>
          <p className="font-medium">Kawet00</p>
          <p className="text-xs text-gray-400">Full-Stack Developer & Student</p>
        </div>
      </div>
      
      <div className="space-y-1 mb-4">
        <div 
          className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer" 
          onClick={() => handleAppClick('about')}
        >
          <i className="ri-user-line mr-3"></i>
          <span>About Me</span>
        </div>
        <div 
          className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer"
          onClick={() => handleAppClick('projects')}
        >
          <i className="ri-folder-line mr-3"></i>
          <span>Projects</span>
        </div>
        <div 
          className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer"
          onClick={() => handleAppClick('skills')}
        >
          <i className="ri-code-s-slash-line mr-3"></i>
          <span>Skills</span>
        </div>
        <div 
          className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer"
          onClick={() => handleAppClick('terminal')}
        >
          <i className="ri-terminal-box-line mr-3"></i>
          <span>Terminal</span>
        </div>
        <div 
          className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer"
          onClick={() => handleAppClick('contact')}
        >
          <i className="ri-mail-line mr-3"></i>
          <span>Contact</span>
        </div>
      </div>
      
      <div className="pt-2 border-t border-gray-700 space-y-1">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer">
          <i className="ri-github-line mr-3"></i>
          <span>Source Code</span>
        </a>
        
        {onLogout && (
          <div 
            className="flex items-center p-2 rounded hover:bg-red-900/50 text-red-400 hover:text-red-300 cursor-pointer" 
            onClick={() => {
              onItemClick();
              onLogout();
            }}
          >
            <i className="ri-shut-down-line mr-3"></i>
            <span>Log Out</span>
          </div>
        )}
      </div>
    </div>
  );
}
