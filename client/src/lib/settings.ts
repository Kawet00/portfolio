import { create } from "zustand";

export type ThemeColor = "blue" | "purple" | "green" | "orange" | "red";
export type WallpaperStyle = "gradient" | "solid" | "image";
export type CursorStyle = "default" | "pointer" | "mac" | "windows98";

export interface SettingsState {
  // Theme settings
  themeColor: ThemeColor;
  wallpaperStyle: WallpaperStyle;
  cursorStyle: CursorStyle;
  showClock: boolean;

  // Methods
  setThemeColor: (color: ThemeColor) => void;
  setWallpaperStyle: (style: WallpaperStyle) => void;
  setCursorStyle: (style: CursorStyle) => void;
  toggleClock: () => void;
}

// Load settings from localStorage or use defaults
const loadSettings = () => {
  const savedTheme = localStorage.getItem('theme-color');
  const savedWallpaper = localStorage.getItem('wallpaper-style');
  const savedCursor = localStorage.getItem('cursor-style');
  const savedClock = localStorage.getItem('show-clock');

  return {
    themeColor: (savedTheme as ThemeColor) || "blue",
    wallpaperStyle: (savedWallpaper as WallpaperStyle) || "gradient",
    cursorStyle: (savedCursor as CursorStyle) || "default",
    showClock: savedClock ? savedClock === 'true' : true,
  };
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...loadSettings(),

  // Methods to update settings
  setThemeColor: (color) => {
    localStorage.setItem('theme-color', color);
    set({ themeColor: color });
  },
  setWallpaperStyle: (style) => {
    localStorage.setItem('wallpaper-style', style);
    set({ wallpaperStyle: style });
  },
  setCursorStyle: (style) => {
    localStorage.setItem('cursor-style', style);
    set({ cursorStyle: style });
  },
  toggleClock: () => set((state) => {
    const newShowClock = !state.showClock;
    localStorage.setItem('show-clock', String(newShowClock));
    return { showClock: newShowClock };
  }),
}));

// Helper functions for applying settings
export function getWallpaperClass(
  style: WallpaperStyle,
  color: ThemeColor,
): string {
  if (style === "gradient") {
    switch (color) {
      case "blue":
        return "bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900";
      case "purple":
        return "bg-gradient-to-br from-purple-900 via-blue-900 to-purple-600";
      case "green":
        return "bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900";
      case "orange":
        return "bg-gradient-to-br from-orange-900 via-amber-600 to-yellow-900";
      case "red":
        return "bg-gradient-to-br from-red-900 via-rose-800 to-pink-900";
      default:
        return "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900";
    }
  } else if (style === "solid") {
    switch (color) {
      case "blue":
        return "bg-blue-900";
      case "purple":
        return "bg-purple-900";
      case "green":
        return "bg-green-900";
      case "orange":
        return "bg-orange-900";
      case "red":
        return "bg-red-900";
      default:
        return "bg-blue-900";
    }
  } else {
    // Image background would be set via CSS with an actual image
    return "bg-cover bg-center";
  }
}

export function getCursorClass(style: CursorStyle): string {
  switch (style) {
    case "default":
      return "cursor-default";
    case "pointer":
      return "cursor-pointer";
    case "mac":
      return "cursor-mac";
    case "windows98":
      return "cursor-win98";
    default:
      return "cursor-default";
  }
}

// Add custom cursor styles
export function initializeCustomCursors() {
  // Add CSS for custom cursors if needed
  const style = document.createElement("style");
  style.textContent = `
    .cursor-mac {
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16.5 16.5"><path fill="white" stroke="black" stroke-width="1" d="M4.5,1l10,10l-3.5,1.5l-2,3.5l-2-10.5L4.5,1z"/></svg>') 0 0, auto;
    }
    
    .cursor-win98 {
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="white" stroke="black" d="M0,0 L10,10 L7,10 L7,14 L5,14 L5,10 L2,10 z"/></svg>') 0 0, auto;
    }
  `;
  document.head.appendChild(style);
}
