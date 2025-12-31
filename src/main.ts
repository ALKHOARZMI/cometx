/**
 * CometX Main Entry Point
 * Initializes the Tri-Lobe Architecture and UI
 */

import { cometx } from './cometx';
import { ChatUI } from './ui/chat';
import { DashboardUI } from './ui/dashboard';
import { TerminalUI } from './ui/terminal';
import './style.css';

// Main app state
let currentView: 'chat' | 'dashboard' | 'terminal' = 'chat';
let chatUI: ChatUI;
let dashboardUI: DashboardUI;
let terminalUI: TerminalUI;

/**
 * Initialize the application
 */
async function init(): Promise<void> {
  try {
    // Show loading screen
    showLoading();

    // Initialize CometX core
    await cometx.initialize({
      model: 'phi-3-mini',
      language: 'en',
    });

    // Initialize UI components
    chatUI = new ChatUI('app');
    dashboardUI = new DashboardUI('app');
    terminalUI = new TerminalUI('app');

    // Setup navigation
    setupNavigation();

    // Hide loading, show app
    hideLoading();
    showView('chat');

    console.log('✅ CometX application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showError(error as Error);
  }
}

/**
 * Setup navigation between views
 */
function setupNavigation(): void {
  const navButtons = document.querySelectorAll('[data-view]');
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const view = (e.target as HTMLElement).getAttribute('data-view') as typeof currentView;
      if (view) {
        showView(view);
      }
    });
  });
}

/**
 * Show a specific view
 */
async function showView(view: typeof currentView): Promise<void> {
  currentView = view;

  // Update navigation active state
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-view="${view}"]`)?.classList.add('active');

  // Show the appropriate view
  const appContainer = document.getElementById('app')!;
  appContainer.innerHTML = '';

  switch (view) {
    case 'chat':
      chatUI = new ChatUI('app');
      break;
    case 'dashboard':
      dashboardUI = new DashboardUI('app');
      await dashboardUI.render();
      break;
    case 'terminal':
      terminalUI = new TerminalUI('app');
      break;
  }
}

/**
 * Show loading screen
 */
function showLoading(): void {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="loading-screen">
      <div class="loading-content">
        <div class="logo">🚀</div>
        <h1>CometX</h1>
        <p>Initializing Tri-Lobe Architecture...</p>
        <div class="loading-steps">
          <div class="loading-step">📚 Memory Lobe...</div>
          <div class="loading-step">🧠 Reasoning Lobe...</div>
          <div class="loading-step">⚡ Execution Lobe...</div>
        </div>
        <div class="loading-spinner"></div>
        <p class="loading-note">🇸🇦 Loading models locally - Your privacy is protected</p>
      </div>
    </div>
  `;
}

/**
 * Hide loading screen
 */
function hideLoading(): void {
  const loading = document.querySelector('.loading-screen');
  if (loading) {
    loading.classList.add('fade-out');
    setTimeout(() => loading.remove(), 500);
  }
}

/**
 * Show error screen
 */
function showError(error: Error): void {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="error-screen">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h1>Initialization Failed</h1>
        <p>${error.message}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    </div>
  `;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
(window as any).cometx = cometx;
(window as any).showView = showView;
