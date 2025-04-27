import { create } from 'zustand';
import { useWindowStore } from './window.ts';

type KonamiCodeStep = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'a' | 'b';

const KONAMI_SEQUENCE: KonamiCodeStep[] = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

type EasterEggState = {
  konamiSequence: string[];
  isKonamiActive: boolean;
  isEasterEggIconVisible: boolean;
  discoveredEggs: Set<string>;
  
  addKonamiKey: (key: string) => void;
  checkKonamiCode: () => boolean;
  activateKonami: () => void;
  deactivateKonami: () => void;
  showEasterEggIcon: () => void;
  addDiscoveredEgg: (eggId: string) => void;
  hasDiscoveredEgg: (eggId: string) => boolean;
};

export const useEasterEggStore = create<EasterEggState>((set, get) => ({
  konamiSequence: [],
  isKonamiActive: false,
  isEasterEggIconVisible: false,
  discoveredEggs: new Set<string>(),
  
  addKonamiKey: (key: string) => set((state) => {
    // Add the key to the sequence
    const newSequence = [...state.konamiSequence, key];
    
    // Keep only the last 10 keys
    if (newSequence.length > 10) {
      newSequence.shift();
    }
    
    return { konamiSequence: newSequence };
  }),
  
  checkKonamiCode: () => {
    const { konamiSequence } = get();
    
    if (konamiSequence.length !== 10) return false;
    
    return konamiSequence.every((key, index) => {
      return key.toLowerCase() === KONAMI_SEQUENCE[index].toLowerCase();
    });
  },
  
  activateKonami: () => {
    // Reset the sequence
    set({ isKonamiActive: true, konamiSequence: [] });
    get().addDiscoveredEgg('konami');
    
    // Open the easter egg window
    const windowStore = useWindowStore.getState();
    windowStore.openWindow('easter-egg');
  },
  
  deactivateKonami: () => set({ isKonamiActive: false }),
  
  showEasterEggIcon: () => {
    set({ isEasterEggIconVisible: true });
    get().addDiscoveredEgg('terminal-hack');
  },
  
  addDiscoveredEgg: (eggId: string) => set((state) => {
    const newDiscoveredEggs = new Set(state.discoveredEggs);
    newDiscoveredEggs.add(eggId);
    return { discoveredEggs: newDiscoveredEggs };
  }),
  
  hasDiscoveredEgg: (eggId: string) => {
    return get().discoveredEggs.has(eggId);
  }
}));

// Function to attach global konami code listener
export function attachKonamiCodeListener() {
  document.addEventListener('keydown', (e) => {
    const easterEggStore = useEasterEggStore.getState();
    easterEggStore.addKonamiKey(e.key);
    
    if (easterEggStore.checkKonamiCode()) {
      easterEggStore.activateKonami();
    }
  });
}

// Terminal commands handler
export const terminalCommands: Record<string, {
  response: string;
  action?: () => void;
}> = {
  'help': {
    response: 'Available commands: help, about, projects, skills, clear, ls, pwd, whoami, exit, hack'
  },
  'about': {
    response: 'Opening about window...',
    action: () => useWindowStore.getState().openWindow('about')
  },
  'projects': {
    response: 'Opening projects window...',
    action: () => useWindowStore.getState().openWindow('projects')
  },
  'skills': {
    response: 'Opening skills window...',
    action: () => useWindowStore.getState().openWindow('skills')
  },
  'clear': {
    response: 'Clearing terminal...'
  },
  'ls': {
    response: 'projects/  documents/  images/  secret/  README.md'
  },
  'pwd': {
    response: '/home/developer'
  },
  'whoami': {
    response: 'developer'
  },
  'exit': {
    response: 'Closing terminal...',
    action: () => useWindowStore.getState().closeWindow('terminal')
  },
  'hack': {
    response: 'INITIATING HACK SEQUENCE... ACCESS GRANTED! EASTER EGG UNLOCKED!',
    action: () => {
      useEasterEggStore.getState().showEasterEggIcon();
    }
  }
};

export function createConfetti() {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500'
  ];

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'absolute rounded-full';
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = confetti.style.width;
      
      // Random color
      confetti.classList.add(colors[Math.floor(Math.random() * colors.length)]);
      
      // Random position
      const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
      confetti.style.left = `${startX}px`;
      confetti.style.top = `${window.innerHeight / 2}px`;
      
      // Animation
      confetti.style.transform = 'translate(-50%, -50%)';
      confetti.style.animation = `fall ${Math.random() * 3 + 2}s forwards`;
      confetti.style.position = 'fixed';
      confetti.style.zIndex = '9999';
      
      // Random rotation and movement
      const angle = Math.random() * 360;
      const distance = Math.random() * 300 + 100;
      const finalX = startX + distance * Math.cos(angle * Math.PI / 180);
      const finalY = window.innerHeight + 100;
      
      // Create keyframe style
      const keyframes = document.createElement('style');
      keyframes.innerHTML = `
        @keyframes fall {
          to {
            transform: translate(${finalX - startX}px, ${finalY - window.innerHeight / 2}px) rotate(${Math.random() * 720 - 360}deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(keyframes);
      
      // Add to body and clean up after animation
      document.body.appendChild(confetti);
      setTimeout(() => {
        confetti.remove();
        keyframes.remove();
      }, 5000);
    }, Math.random() * 500);
  }
}
