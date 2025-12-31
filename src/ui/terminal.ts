/**
 * Terminal UI Component
 * Command-line interface for direct code execution
 */

import { executionLobe } from '../lobes/execution';
import { t, formatExecutionTime, type Language } from '../utils/i18n';

export class TerminalUI {
  private container: HTMLElement;
  private outputContainer: HTMLElement;
  private inputElement: HTMLInputElement;
  private history: string[] = [];
  private historyIndex = -1;
  private currentLanguage: Language = 'en';

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    this.container = container;

    this.container.innerHTML = this.createHTML();
    
    this.outputContainer = document.getElementById('terminal-output')!;
    this.inputElement = document.getElementById('terminal-input') as HTMLInputElement;

    this.attachEventListeners();
    this.printWelcome();
  }

  private createHTML(): string {
    return `
      <div class="terminal-container">
        <div class="terminal-header">
          <span class="terminal-title">CometX Terminal</span>
          <span class="terminal-subtitle">Safe sandboxed execution environment</span>
        </div>
        <div id="terminal-output" class="terminal-output"></div>
        <div class="terminal-input-line">
          <span class="terminal-prompt">❯</span>
          <input 
            id="terminal-input" 
            type="text" 
            class="terminal-input" 
            placeholder="Type JavaScript code or math expression..."
            autocomplete="off"
          />
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleCommand();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
      }
    });
  }

  private async handleCommand(): Promise<void> {
    const command = this.inputElement.value.trim();
    if (!command) return;

    // Add to history
    this.history.push(command);
    this.historyIndex = this.history.length;

    // Display command
    this.printLine(`<span class="terminal-prompt">❯</span> ${command}`, 'command');

    // Clear input
    this.inputElement.value = '';

    // Check for special commands
    if (command === 'clear') {
      this.clearOutput();
      return;
    }

    if (command === 'help') {
      this.printHelp();
      return;
    }

    if (command === 'history') {
      this.printHistory();
      return;
    }

    // Execute code
    try {
      const result = await executionLobe.execute(command);
      
      if (result.success) {
        this.printLine(`➜ ${JSON.stringify(result.result, null, 2)}`, 'success');
      } else {
        this.printLine(`✗ Error: ${result.error}`, 'error');
      }

      // Print logs if any
      if (result.logs && result.logs.length > 0) {
        result.logs.forEach(log => {
          this.printLine(log, 'log');
        });
      }

      // Print execution time
      this.printLine(`⏱ ${formatExecutionTime(result.executionTime)}`, 'info');
    } catch (error: any) {
      this.printLine(`✗ Error: ${error.message}`, 'error');
    }
  }

  private printWelcome(): void {
    this.printLine('╔══════════════════════════════════════════════════╗', 'info');
    this.printLine('║       CometX Terminal - Execution Lobe          ║', 'info');
    this.printLine('║   Safe sandboxed JavaScript execution engine    ║', 'info');
    this.printLine('║   Type "help" for available commands            ║', 'info');
    this.printLine('╚══════════════════════════════════════════════════╝', 'info');
    this.printLine('', 'info');
  }

  private printHelp(): void {
    this.printLine('Available commands:', 'info');
    this.printLine('  clear     - Clear terminal output', 'info');
    this.printLine('  help      - Show this help message', 'info');
    this.printLine('  history   - Show command history', 'info');
    this.printLine('', 'info');
    this.printLine('Examples:', 'info');
    this.printLine('  Math.sqrt(16)', 'info');
    this.printLine('  [1,2,3].map(x => x * 2)', 'info');
    this.printLine('  const sum = (a, b) => a + b; sum(5, 3)', 'info');
  }

  private printHistory(): void {
    this.printLine('Command history:', 'info');
    this.history.forEach((cmd, i) => {
      this.printLine(`  ${i + 1}. ${cmd}`, 'info');
    });
  }

  private printLine(text: string, type: 'command' | 'success' | 'error' | 'log' | 'info' = 'info'): void {
    const line = document.createElement('div');
    line.className = `terminal-line terminal-${type}`;
    line.innerHTML = text;
    this.outputContainer.appendChild(line);
    this.scrollToBottom();
  }

  private clearOutput(): void {
    this.outputContainer.innerHTML = '';
    this.printWelcome();
  }

  private scrollToBottom(): void {
    this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
  }

  private navigateHistory(direction: number): void {
    const newIndex = this.historyIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.history.length) {
      this.historyIndex = newIndex;
      this.inputElement.value = this.history[this.historyIndex];
    } else if (newIndex === this.history.length) {
      this.historyIndex = newIndex;
      this.inputElement.value = '';
    }
  }

  public setLanguage(lang: Language): void {
    this.currentLanguage = lang;
  }
}
