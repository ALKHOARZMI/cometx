import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { Trash2, Plus } from 'lucide-react';

const Terminal: React.FC = () => {
  const { t } = useTranslation();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm
    const xterm = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#0a0a0a',
        foreground: '#4ade80',
        cursor: '#10b981',
        black: '#000000',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#ffffff',
        brightBlack: '#6b7280',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#fbbf24',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      },
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Welcome message
    xterm.writeln('\x1b[1;32m╔══════════════════════════════════════════════════════════╗\x1b[0m');
    xterm.writeln('\x1b[1;32m║         CometX Terminal - Local-First AI Platform        ║\x1b[0m');
    xterm.writeln('\x1b[1;32m╚══════════════════════════════════════════════════════════╝\x1b[0m');
    xterm.writeln('');
    xterm.writeln('\x1b[1;36mWelcome to CometX integrated terminal!\x1b[0m');
    xterm.writeln('This is a demonstration terminal interface.');
    xterm.writeln('');
    xterm.write('\x1b[1;32m$\x1b[0m ');

    let currentLine = '';

    // Handle user input
    xterm.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter key
        xterm.write('\r\n');
        if (currentLine.trim()) {
          executeCommand(currentLine.trim(), xterm);
        }
        currentLine = '';
        xterm.write('\x1b[1;32m$\x1b[0m ');
      } else if (code === 127) {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          xterm.write('\b \b');
        }
      } else if (code >= 32) {
        // Printable characters
        currentLine += data;
        xterm.write(data);
      }
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      xterm.dispose();
    };
  }, []);

  const executeCommand = (cmd: string, xterm: XTerm) => {
    const parts = cmd.split(' ');
    const command = parts[0];

    switch (command) {
      case 'help':
        xterm.writeln('Available commands:');
        xterm.writeln('  help     - Show this help message');
        xterm.writeln('  clear    - Clear the terminal');
        xterm.writeln('  echo     - Echo a message');
        xterm.writeln('  date     - Show current date and time');
        xterm.writeln('  whoami   - Display current user');
        xterm.writeln('  about    - About CometX');
        break;
      case 'clear':
        xterm.clear();
        break;
      case 'echo':
        xterm.writeln(parts.slice(1).join(' '));
        break;
      case 'date':
        xterm.writeln(new Date().toString());
        break;
      case 'whoami':
        xterm.writeln('cometx-user');
        break;
      case 'about':
        xterm.writeln('\x1b[1;32mCometX - Sovereign Local-First AI Platform\x1b[0m');
        xterm.writeln('100% on-device AI processing');
        xterm.writeln('Privacy-first design');
        xterm.writeln('Built with React 18, TypeScript, and Vite');
        break;
      default:
        xterm.writeln(`\x1b[1;31mCommand not found: ${command}\x1b[0m`);
        xterm.writeln('Type "help" for available commands');
    }
  };

  const handleClear = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.write('\x1b[1;32m$\x1b[0m ');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <div className="border-b border-neon-green-500/20 p-6 bg-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold neon-text">{t('terminal.title')}</h1>
          <div className="flex gap-3">
            <button onClick={handleClear} className="btn-neon flex items-center gap-2">
              <Trash2 size={16} />
              {t('terminal.clear')}
            </button>
            <button className="btn-neon flex items-center gap-2">
              <Plus size={16} />
              {t('terminal.newTab')}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 p-6 bg-gray-950">
        <div
          ref={terminalRef}
          className="h-full border border-neon-green-500/20 rounded-lg overflow-hidden bg-[#0a0a0a]"
        />
      </div>
    </div>
  );
};

export default Terminal;
