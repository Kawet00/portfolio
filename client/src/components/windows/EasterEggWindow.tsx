import { createConfetti } from '@/lib/easterEggs';

export default function EasterEggWindow() {
  const handleConfettiClick = () => {
    createConfetti();
  };
  
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-3">You Found A Secret!</h3>
      <p className="mb-4">Congratulations on discovering this hidden easter egg!</p>
      <div className="p-4 bg-purple-900/30 rounded-lg mb-4">
        <p className="text-sm mb-2">There are several more easter eggs hidden throughout this portfolio:</p>
        <ul className="text-sm text-left space-y-2">
          <li className="flex items-center">
            <i className="ri-checkbox-blank-circle-line mr-2 text-xs"></i>
            Try typing special commands in the terminal
          </li>
          <li className="flex items-center">
            <i className="ri-checkbox-blank-circle-line mr-2 text-xs"></i>
            Look for hidden files in the trash
          </li>
          <li className="flex items-center">
            <i className="ri-checkbox-blank-circle-line mr-2 text-xs"></i>
            Enter the Konami code on any window (↑↑↓↓←→←→BA)
          </li>
          <li className="flex items-center">
            <i className="ri-checkbox-blank-circle-line mr-2 text-xs"></i>
            And more... keep exploring!
          </li>
        </ul>
      </div>
      <button 
        onClick={handleConfettiClick}
        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Celebration Time!
      </button>
    </div>
  );
}
