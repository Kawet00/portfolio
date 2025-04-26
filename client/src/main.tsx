import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for portfolio
const style = document.createElement('style');
style.textContent = `
  body {
    overflow: hidden;
    user-select: none;
  }
  
  .window {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    max-height: 90vh;
    max-width: 95%;
    transition: transform 0.2s, box-shadow 0.3s, opacity 0.2s;
  }
  
  .window:active {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    cursor: grabbing;
    opacity: 0.92;
    transform: scale(1.01);
  }
  
  .window-content {
    max-height: calc(90vh - 40px);
    overflow-y: auto;
  }
  
  .easter-egg {
    transition: all 0.3s;
  }
  
  .desktop-icon:hover {
    transform: scale(1.05);
  }
  
  .desktop-icon:active {
    transform: scale(0.95);
  }
  
  .project-card {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .konami-active .window {
    animation: rainbow-border 3s infinite;
  }
  
  @keyframes rainbow-border {
    0% { border-color: #ff0000; }
    20% { border-color: #ff9900; }
    40% { border-color: #33cc33; }
    60% { border-color: #3399ff; }
    80% { border-color: #cc33ff; }
    100% { border-color: #ff0000; }
  }
  
  /* For WebKit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  .taskbar-item {
    transition: all 0.2s;
  }
  
  .taskbar-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .animate-cursor-blink {
    animation: blink 1s step-end infinite;
  }
  
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  .animate-bounce-subtle {
    animation: bounce-subtle 2s infinite;
  }
`;

document.head.appendChild(style);

// Add Remix icons
const remixIconsLink = document.createElement('link');
remixIconsLink.rel = 'stylesheet';
remixIconsLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
document.head.appendChild(remixIconsLink);

// Add Google Fonts
const fontsLink = document.createElement('link');
fontsLink.rel = 'stylesheet';
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap';
document.head.appendChild(fontsLink);

createRoot(document.getElementById("root")!).render(<App />);
