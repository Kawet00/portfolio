import { create } from 'zustand';

export type WindowPosition = {
  x: number;
  y: number;
  width?: string;
  height?: string;
};

export type WindowId = 
  | 'about'
  | 'projects'
  | 'terminal'
  | 'contact'
  | 'skills'
  | 'trash'
  | 'easter-egg'
  | 'secret-project'
  | 'settings';

export type WindowState = {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: WindowPosition;
  zIndex: number;
  icon: string;
};

type WindowsStore = {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  highestZIndex: number;
  
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  bringToFront: (id: WindowId) => void;
  updatePosition: (id: WindowId, position: Partial<WindowPosition>) => void;
  setWindowOpen: (id: WindowId, isOpen: boolean) => void;
  isWindowOpen: (id: WindowId) => boolean;
};

// Default window positions centered in the viewport
const getDefaultPosition = (id: WindowId): WindowPosition => {
  return {
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 200,
  };
};

// Default window properties
const createDefaultWindow = (
  id: WindowId, 
  title: string, 
  icon: string, 
  position: WindowPosition = getDefaultPosition(id)
): WindowState => ({
  id,
  title,
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  position,
  zIndex: 10,
  icon,
});

export const useWindowStore = create<WindowsStore>((set, get) => ({
  windows: {
    'about': createDefaultWindow('about', 'About Me', 'ri-user-line'),
    'projects': createDefaultWindow('projects', 'Projects', 'ri-folder-line'),
    'terminal': createDefaultWindow('terminal', 'Terminal', 'ri-terminal-box-line'),
    'contact': createDefaultWindow('contact', 'Contact', 'ri-mail-line'),
    'skills': createDefaultWindow('skills', 'Skills', 'ri-code-s-slash-line'),
    'trash': createDefaultWindow('trash', 'Trash', 'ri-delete-bin-line'),
    'easter-egg': createDefaultWindow('easter-egg', '🎉 Easter Egg! 🎉', 'ri-egg-line'),
    'secret-project': createDefaultWindow('secret-project', 'secret_project.txt', 'ri-file-text-line'),
    'settings': createDefaultWindow('settings', 'Settings', 'ri-settings-line'),
  },
  activeWindowId: null,
  highestZIndex: 10,

  openWindow: (id) => set((state) => {
    const newZIndex = state.highestZIndex + 1;
    return {
      activeWindowId: id,
      highestZIndex: newZIndex,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: newZIndex,
        },
      },
    };
  }),

  closeWindow: (id) => set((state) => ({
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    windows: {
      ...state.windows,
      [id]: {
        ...state.windows[id],
        isOpen: false,
      },
    },
  })),

  minimizeWindow: (id) => set((state) => ({
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    windows: {
      ...state.windows,
      [id]: {
        ...state.windows[id],
        isMinimized: true,
      },
    },
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: {
        ...state.windows[id],
        isMaximized: true,
      },
    },
  })),

  restoreWindow: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: {
        ...state.windows[id],
        isMaximized: false,
      },
    },
  })),

  bringToFront: (id) => set((state) => {
    // Only update if window exists and is open
    if (!state.windows[id] || !state.windows[id].isOpen) return state;
    
    const newZIndex = state.highestZIndex + 1;
    return {
      activeWindowId: id,
      highestZIndex: newZIndex,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          zIndex: newZIndex,
          isMinimized: false,
        },
      },
    };
  }),

  updatePosition: (id, position) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: {
        ...state.windows[id],
        position: {
          ...state.windows[id].position,
          ...position,
        },
      },
    },
  })),

  setWindowOpen: (id, isOpen) => {
    if (isOpen) {
      get().openWindow(id);
    } else {
      get().closeWindow(id);
    }
  },

  isWindowOpen: (id) => {
    const state = get();
    return state.windows[id]?.isOpen && !state.windows[id]?.isMinimized;
  },
}));
