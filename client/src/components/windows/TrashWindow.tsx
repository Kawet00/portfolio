import { useWindowStore } from '@/lib/window';
import { useEasterEggStore } from '@/lib/easterEggs';

export default function TrashWindow() {
  const openWindow = useWindowStore(state => state.openWindow);
  const { addDiscoveredEgg } = useEasterEggStore();
  
  const handleSecretFileClick = () => {
    openWindow('secret-project');
    addDiscoveredEgg('secret-file');
  };
  
  const handleKonamiFileClick = () => {
    addDiscoveredEgg('konami-file');
  };
  
  const handleEmptyTrash = () => {
    // Easter egg: No actual functionality, just for show
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Trash Contents</h3>
        <button 
          className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
          onClick={handleEmptyTrash}
        >
          Empty Trash
        </button>
      </div>
      
      <div className="space-y-2">
        <div 
          className="p-2 bg-gray-700 rounded flex items-center justify-between cursor-pointer hover:bg-gray-600"
          onClick={handleSecretFileClick}
        >
          <div className="flex items-center">
            <i className="ri-file-text-line mr-2 text-gray-400"></i>
            <span>secret_project.txt</span>
          </div>
          <div className="text-xs text-gray-400">2KB</div>
        </div>
        
        <div className="p-2 bg-gray-700 rounded flex items-center justify-between">
          <div className="flex items-center">
            <i className="ri-file-image-line mr-2 text-gray-400"></i>
            <span>old_design.png</span>
          </div>
          <div className="text-xs text-gray-400">1.2MB</div>
        </div>
        
        <div className="p-2 bg-gray-700 rounded flex items-center justify-between">
          <div className="flex items-center">
            <i className="ri-folder-line mr-2 text-gray-400"></i>
            <span>deprecated_code</span>
          </div>
          <div className="text-xs text-gray-400">Folder</div>
        </div>
        
        <div 
          className="p-2 bg-gray-700 rounded flex items-center justify-between cursor-pointer hover:bg-gray-600"
          onClick={handleKonamiFileClick}
        >
          <div className="flex items-center">
            <i className="ri-gamepad-line mr-2 text-gray-400"></i>
            <span>konami.js</span>
          </div>
          <div className="text-xs text-gray-400">4KB</div>
        </div>
        
        <div className="p-2 bg-gray-700 rounded flex items-center justify-between">
          <div className="flex items-center">
            <i className="ri-file-list-line mr-2 text-gray-400"></i>
            <span>todo_2022.md</span>
          </div>
          <div className="text-xs text-gray-400">512B</div>
        </div>
      </div>
    </div>
  );
}
