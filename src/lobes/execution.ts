/**
 * Execution Lobe - Safe sandboxed code execution using Web Workers
 * Provides isolated environment for running user code
 */

export interface ExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  logs?: string[];
  executionTime: number;
}

class ExecutionLobe {
  private worker: Worker | null = null;
  private isInitialized = false;

  /**
   * Initialize the execution lobe with a Web Worker
   */
  async initialize(): Promise<void> {
    try {
      // Create worker from the worker file
      this.worker = new Worker(
        new URL('../workers/execution.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.isInitialized = true;
      console.log('Execution Lobe initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Execution Lobe:', error);
      throw new Error(`Failed to initialize worker: ${error}`);
    }
  }

  /**
   * Execute code in a safe sandboxed environment
   */
  async execute(
    code: string,
    context?: Record<string, any>
  ): Promise<ExecutionResult> {
    if (!this.isInitialized || !this.worker) {
      throw new Error('Execution Lobe not initialized. Call initialize() first.');
    }

    const startTime = performance.now();

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({
          success: false,
          error: 'Execution timeout (5 seconds)',
          executionTime: performance.now() - startTime,
        });
      }, 5000); // 5 second timeout

      this.worker!.onmessage = (event) => {
        clearTimeout(timeout);
        const executionTime = performance.now() - startTime;

        if (event.data.type === 'result') {
          resolve({
            success: true,
            result: event.data.result,
            logs: event.data.logs,
            executionTime,
          });
        } else if (event.data.type === 'error') {
          resolve({
            success: false,
            error: event.data.error,
            logs: event.data.logs,
            executionTime,
          });
        }
      };

      this.worker!.onerror = (error) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          error: error.message || 'Unknown worker error',
          executionTime: performance.now() - startTime,
        });
      };

      // Send code to worker
      this.worker!.postMessage({
        type: 'execute',
        code,
        context,
      });
    });
  }

  /**
   * Execute simple math expressions
   */
  async executeMath(expression: string): Promise<ExecutionResult> {
    const code = `return ${expression};`;
    return this.execute(code);
  }

  /**
   * Check if the lobe is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Terminate the worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      console.log('Execution Lobe terminated');
    }
  }
}

// Export singleton instance
export const executionLobe = new ExecutionLobe();
