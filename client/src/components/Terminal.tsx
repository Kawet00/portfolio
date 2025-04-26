import { useState, useEffect, useRef } from 'react';
import { terminalCommands } from '../lib/easterEggs';

type TerminalProps = {
  className?: string;
};

export default function Terminal({ className = '' }: TerminalProps) {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<{type: 'command' | 'response', text: string}[]>([
    { type: 'response', text: 'Welcome to DevOS v1.0.0' },
    { type: 'response', text: 'Type help to see available commands' }
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when output changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (cmd: string) => {
    // Add command to output
    setOutput(prev => [...prev, { type: 'command', text: cmd }]);
    
    // Add to history
    setCommandHistory(prev => [...prev, cmd]);
    
    // Process command
    if (cmd === 'clear') {
      // Special case for clear
      setOutput([]);
    } else {
      // Process other commands
      const response = terminalCommands[cmd]?.response || `Command not found: ${cmd}`;
      setOutput(prev => [...prev, { type: 'response', text: response }]);
      
      // Execute any associated action
      if (terminalCommands[cmd]?.action) {
        setTimeout(() => {
          terminalCommands[cmd].action!();
        }, 500);
      }
    }
    
    // Reset current command
    setCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (command.trim()) {
        handleCommand(command.trim());
      }
    }
  };

  return (
    <div 
      ref={terminalRef}
      className={`p-4 font-mono text-sm bg-terminal-bg text-terminal-text ${className}`}
    >
      {output.map((line, index) => (
        <div key={index} className="mb-2">
          {line.type === 'command' ? (
            <div>
              <span className="text-terminal-blue">guest@portfolio</span>:
              <span className="text-terminal-green">~</span>$ {line.text}
            </div>
          ) : (
            <div className={line.text.includes('ERROR') ? 'text-terminal-red' : ''}>
              {line.text}
            </div>
          )}
        </div>
      ))}
      
      <div className="mb-2 flex">
        <span className="text-terminal-blue">guest@portfolio</span>:
        <span className="text-terminal-green">~</span>$ 
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none ml-1"
          autoFocus
        />
        <span className="terminal-cursor animate-cursor-blink">_</span>
      </div>
    </div>
  );
}
