/**
 * Execution Worker - Safe sandboxed code execution
 * Runs in a Web Worker for security isolation
 */

// Message types
interface ExecutionRequest {
  type: 'execute';
  code: string;
  context?: Record<string, any>;
}

interface ExecutionResponse {
  type: 'result' | 'error';
  result?: any;
  error?: string;
  logs?: string[];
}

// Capture console logs
const logs: string[] = [];
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
};

console.log = (...args: any[]) => {
  logs.push(`LOG: ${args.join(' ')}`);
  originalConsole.log(...args);
};

console.error = (...args: any[]) => {
  logs.push(`ERROR: ${args.join(' ')}`);
  originalConsole.error(...args);
};

console.warn = (...args: any[]) => {
  logs.push(`WARN: ${args.join(' ')}`);
  originalConsole.warn(...args);
};

/**
 * Safe evaluation function with limited scope
 */
function safeEval(code: string, context: Record<string, any> = {}): any {
  // Create safe Math functions
  const safeMath = {
    abs: Math.abs,
    acos: Math.acos,
    asin: Math.asin,
    atan: Math.atan,
    atan2: Math.atan2,
    ceil: Math.ceil,
    cos: Math.cos,
    exp: Math.exp,
    floor: Math.floor,
    log: Math.log,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
    random: Math.random,
    round: Math.round,
    sin: Math.sin,
    sqrt: Math.sqrt,
    tan: Math.tan,
    PI: Math.PI,
    E: Math.E,
  };

  // Create safe execution context
  const safeContext = {
    Math: safeMath,
    console: {
      log: console.log,
      error: console.error,
      warn: console.warn,
    },
    JSON: JSON,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date,
    ...context,
  };

  // Create a function with the safe context
  const contextKeys = Object.keys(safeContext);
  const contextValues = Object.values(safeContext);

  // Wrap code in a function to capture return value
  const wrappedCode = `
    "use strict";
    return (function() {
      ${code}
    })();
  `;

  // Create and execute function with limited scope
  const func = new Function(...contextKeys, wrappedCode);
  return func(...contextValues);
}

// Handle messages from main thread
self.onmessage = (event: MessageEvent<ExecutionRequest>) => {
  logs.length = 0; // Clear previous logs

  if (event.data.type === 'execute') {
    try {
      const result = safeEval(event.data.code, event.data.context);
      
      const response: ExecutionResponse = {
        type: 'result',
        result,
        logs: [...logs],
      };
      
      self.postMessage(response);
    } catch (error: any) {
      const response: ExecutionResponse = {
        type: 'error',
        error: error.message || String(error),
        logs: [...logs],
      };
      
      self.postMessage(response);
    }
  }
};
