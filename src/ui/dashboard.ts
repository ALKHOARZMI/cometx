/**
 * Dashboard UI Component
 * Shows conversations, preferences, and system status
 */

import { cometx } from '../cometx';
import type { Conversation, UserPreferences } from '../lobes/memory';
import { t, applyRTL, formatTime, type Language } from '../utils/i18n';

export class DashboardUI {
  private container: HTMLElement;
  private currentLanguage: Language = 'en';

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    this.container = container;
  }

  public async render(): Promise<void> {
    const preferences = await cometx.getPreferences();
    const conversations = await cometx.getConversations();
    
    this.currentLanguage = preferences.language;
    applyRTL(preferences.rtl);

    this.container.innerHTML = this.createHTML(preferences, conversations);
    this.attachEventListeners();
  }

  private createHTML(preferences: UserPreferences, conversations: Conversation[]): string {
    return `
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h1>${t('dashboard', this.currentLanguage)}</h1>
        </div>

        <div class="dashboard-content">
          <!-- Preferences Section -->
          <div class="dashboard-section">
            <h2>${t('preferences', this.currentLanguage)}</h2>
            <div class="preferences-grid">
              <div class="preference-item">
                <label>${t('language', this.currentLanguage)}</label>
                <select id="language-select">
                  <option value="en" ${preferences.language === 'en' ? 'selected' : ''}>English</option>
                  <option value="ar" ${preferences.language === 'ar' ? 'selected' : ''}>العربية</option>
                </select>
              </div>

              <div class="preference-item">
                <label>${t('theme', this.currentLanguage)}</label>
                <select id="theme-select">
                  <option value="light" ${preferences.theme === 'light' ? 'selected' : ''}>${t('light', this.currentLanguage)}</option>
                  <option value="dark" ${preferences.theme === 'dark' ? 'selected' : ''}>${t('dark', this.currentLanguage)}</option>
                </select>
              </div>

              <div class="preference-item">
                <label>${t('model', this.currentLanguage)}</label>
                <select id="model-select">
                  <option value="phi-3-mini" ${preferences.model === 'phi-3-mini' ? 'selected' : ''}>Phi-3 Mini</option>
                  <option value="gemma-2b" ${preferences.model === 'gemma-2b' ? 'selected' : ''}>Gemma 2B</option>
                </select>
              </div>
            </div>
            <button id="save-preferences" class="button-primary">${t('send', this.currentLanguage)}</button>
          </div>

          <!-- Conversations Section -->
          <div class="dashboard-section">
            <h2>${t('conversations', this.currentLanguage)}</h2>
            <div class="conversations-list">
              ${conversations.length === 0 
                ? `<p class="no-conversations">${t('noConversations', this.currentLanguage)}</p>`
                : conversations.map(conv => this.renderConversation(conv)).join('')
              }
            </div>
          </div>

          <!-- Privacy Section -->
          <div class="dashboard-section">
            <h2>Privacy Controls</h2>
            <p>${t('sovereignty', this.currentLanguage)}</p>
            <button id="clear-data" class="button-danger">${t('clear', this.currentLanguage)}</button>
          </div>
        </div>
      </div>
    `;
  }

  private renderConversation(conv: Conversation): string {
    return `
      <div class="conversation-item" data-id="${conv.id}">
        <div class="conversation-title">${conv.title}</div>
        <div class="conversation-meta">
          ${formatTime(conv.updatedAt, this.currentLanguage)} • ${conv.messages.length} messages
        </div>
        <button class="conversation-delete" data-id="${conv.id}">×</button>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Save preferences
    const saveBtn = document.getElementById('save-preferences');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.savePreferences());
    }

    // Clear data
    const clearBtn = document.getElementById('clear-data');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearData());
    }

    // Delete conversation
    const deleteButtons = document.querySelectorAll('.conversation-delete');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) this.deleteConversation(id);
      });
    });

    // Language change
    const langSelect = document.getElementById('language-select') as HTMLSelectElement;
    if (langSelect) {
      langSelect.addEventListener('change', () => {
        this.currentLanguage = langSelect.value as Language;
        applyRTL(this.currentLanguage === 'ar');
      });
    }
  }

  private async savePreferences(): Promise<void> {
    const langSelect = document.getElementById('language-select') as HTMLSelectElement;
    const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    const modelSelect = document.getElementById('model-select') as HTMLSelectElement;

    const preferences: Partial<UserPreferences> = {
      language: langSelect.value as 'ar' | 'en',
      theme: themeSelect.value as 'light' | 'dark',
      model: modelSelect.value as 'phi-3-mini' | 'gemma-2b',
      rtl: langSelect.value === 'ar',
    };

    await cometx.updatePreferences(preferences);
    alert('Preferences saved!');
    await this.render(); // Refresh
  }

  private async clearData(): Promise<void> {
    if (confirm(t('clearConfirm', this.currentLanguage))) {
      await cometx.clearAllData();
      await this.render(); // Refresh
    }
  }

  private async deleteConversation(id: string): Promise<void> {
    await cometx.deleteConversation(id);
    await this.render(); // Refresh
  }
}
