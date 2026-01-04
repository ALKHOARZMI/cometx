/**
 * Chat UI Component
 * Main chat interface for CometX
 */

import { cometx } from '../cometx';
import type { Message } from '../lobes/memory';
import { t, applyRTL, formatTime, formatExecutionTime, type Language } from '../utils/i18n';

export class ChatUI {
  private container: HTMLElement;
  private messagesContainer: HTMLElement;
  private inputArea: HTMLTextAreaElement;
  private sendButton: HTMLButtonElement;
  private currentLanguage: Language = 'en';
  private isProcessing = false;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    this.container = container;

    // Create UI structure
    this.container.innerHTML = this.createHTML();

    // Get references
    this.messagesContainer = document.getElementById('chat-messages')!;
    this.inputArea = document.getElementById('chat-input') as HTMLTextAreaElement;
    this.sendButton = document.getElementById('send-button') as HTMLButtonElement;

    // Attach event listeners
    this.attachEventListeners();
  }

  private createHTML(): string {
    return `
      <div class="chat-container">
        <div class="chat-header">
          <h1>${t('title', this.currentLanguage)}</h1>
          <p>${t('subtitle', this.currentLanguage)}</p>
        </div>
        <div id="chat-messages" class="chat-messages"></div>
        <div class="chat-input-container">
          <textarea 
            id="chat-input" 
            class="chat-input" 
            placeholder="${t('placeholder', this.currentLanguage)}"
            rows="3"
          ></textarea>
          <button id="send-button" class="send-button">${t('send', this.currentLanguage)}</button>
        </div>
        <div class="chat-footer">
          ${t('sovereignty', this.currentLanguage)}
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Send message on button click
    this.sendButton.addEventListener('click', () => this.handleSend());

    // Send message on Ctrl+Enter
    this.inputArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.handleSend();
      }
    });
  }

  private async handleSend(): Promise<void> {
    if (this.isProcessing) return;

    const content = this.inputArea.value.trim();
    if (!content) return;

    this.isProcessing = true;
    this.sendButton.disabled = true;
    this.inputArea.disabled = true;

    // Clear input
    this.inputArea.value = '';

    // Add user message to UI
    this.addMessage({
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    });

    // Show thinking indicator
    const thinkingId = this.showThinking();

    try {
      // Get or create conversation
      let convId = cometx.getCurrentConversationId();
      if (!convId) {
        const conv = await cometx.createConversation('New Conversation');
        convId = conv.id;
      }

      // Send message and get response
      const response = await cometx.sendMessage(content, convId);

      // Remove thinking indicator
      this.removeThinking(thinkingId);

      // Add assistant message to UI
      this.addMessage(response.message);

      // Show execution result if available
      if (response.executionResult) {
        this.addExecutionResult(response.executionResult);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      this.removeThinking(thinkingId);
      this.addError(error.message || 'Failed to get response');
    } finally {
      this.isProcessing = false;
      this.sendButton.disabled = false;
      this.inputArea.disabled = false;
      this.inputArea.focus();
    }
  }

  private addMessage(message: Message): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${message.role}`;
    
    const time = formatTime(message.timestamp, this.currentLanguage);
    
    messageDiv.innerHTML = `
      <div class="message-header">
        <strong>${message.role === 'user' ? 'You' : 'CometX'}</strong>
        <span class="message-time">${time}</span>
      </div>
      <div class="message-content">${this.formatContent(message.content)}</div>
      ${message.model ? `<div class="message-model">Model: ${message.model}</div>` : ''}
    `;

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  private formatContent(content: string): string {
    // Escape HTML to prevent XSS attacks
    const escapeHtml = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    // Process in order: code blocks first, then inline code, then bold/italic
    // This prevents nested markdown from breaking
    
    // 1. Code blocks (triple backticks) - these take highest priority
    const codeBlockPlaceholders: string[] = [];
    let formatted = content.replace(/```([\s\S]*?)```/g, (_match, code) => {
      const placeholder = `__CODEBLOCK_${codeBlockPlaceholders.length}__`;
      codeBlockPlaceholders.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
      return placeholder;
    });

    // 2. Inline code (single backticks)
    const inlineCodePlaceholders: string[] = [];
    formatted = formatted.replace(/`([^`]+)`/g, (_match, code) => {
      const placeholder = `__INLINECODE_${inlineCodePlaceholders.length}__`;
      inlineCodePlaceholders.push(`<code>${escapeHtml(code)}</code>`);
      return placeholder;
    });

    // 3. Bold text (must be processed before italic to handle ** before *)
    const boldPlaceholders: string[] = [];
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, (_match, text) => {
      const placeholder = `__BOLD_${boldPlaceholders.length}__`;
      boldPlaceholders.push(`<strong>${escapeHtml(text)}</strong>`);
      return placeholder;
    });

    // 4. Italic text
    const italicPlaceholders: string[] = [];
    formatted = formatted.replace(/\*([^*]+)\*/g, (_match, text) => {
      const placeholder = `__ITALIC_${italicPlaceholders.length}__`;
      italicPlaceholders.push(`<em>${escapeHtml(text)}</em>`);
      return placeholder;
    });

    // 5. Escape any remaining text (everything not in placeholders)
    formatted = escapeHtml(formatted);

    // 6. Restore placeholders in reverse order
    italicPlaceholders.forEach((replacement, index) => {
      formatted = formatted.replace(`__ITALIC_${index}__`, replacement);
    });
    boldPlaceholders.forEach((replacement, index) => {
      formatted = formatted.replace(`__BOLD_${index}__`, replacement);
    });
    inlineCodePlaceholders.forEach((replacement, index) => {
      formatted = formatted.replace(`__INLINECODE_${index}__`, replacement);
    });
    codeBlockPlaceholders.forEach((replacement, index) => {
      formatted = formatted.replace(`__CODEBLOCK_${index}__`, replacement);
    });

    // 7. Convert line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  }

  private addExecutionResult(result: any): void {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'execution-result';
    
    let resultHTML = `<div class="result-header">${t('executionResult', this.currentLanguage)}</div>`;
    
    if (result.success) {
      resultHTML += `<div class="result-success">
        <strong>Result:</strong> ${JSON.stringify(result.result, null, 2)}
      </div>`;
    } else {
      resultHTML += `<div class="result-error">
        <strong>Error:</strong> ${result.error}
      </div>`;
    }
    
    if (result.logs && result.logs.length > 0) {
      resultHTML += `<div class="result-logs">
        <strong>Logs:</strong><br>
        ${result.logs.join('<br>')}
      </div>`;
    }
    
    resultHTML += `<div class="result-time">
      ${t('executionTime', this.currentLanguage)}: ${formatExecutionTime(result.executionTime)}
    </div>`;
    
    resultDiv.innerHTML = resultHTML;
    this.messagesContainer.appendChild(resultDiv);
    this.scrollToBottom();
  }

  private showThinking(): string {
    const thinkingId = `thinking-${Date.now()}`;
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = thinkingId;
    thinkingDiv.className = 'message message-thinking';
    thinkingDiv.innerHTML = `
      <div class="message-content">
        ${t('thinking', this.currentLanguage)}
        <span class="thinking-dots">...</span>
      </div>
    `;
    this.messagesContainer.appendChild(thinkingDiv);
    this.scrollToBottom();
    return thinkingId;
  }

  private removeThinking(thinkingId: string): void {
    const thinkingDiv = document.getElementById(thinkingId);
    if (thinkingDiv) {
      thinkingDiv.remove();
    }
  }

  private addError(error: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message message-error';
    errorDiv.innerHTML = `
      <div class="message-header">
        <strong>${t('errorTitle', this.currentLanguage)}</strong>
      </div>
      <div class="message-content">${error}</div>
    `;
    this.messagesContainer.appendChild(errorDiv);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  public setLanguage(lang: Language): void {
    this.currentLanguage = lang;
    applyRTL(lang === 'ar');
    // Refresh UI with new language
    this.updateUIText();
  }

  private updateUIText(): void {
    // Update placeholder and button text
    this.inputArea.placeholder = t('placeholder', this.currentLanguage);
    this.sendButton.textContent = t('send', this.currentLanguage);
  }

  public async loadConversation(conversationId: string): Promise<void> {
    const conversation = await cometx.getConversation(conversationId);
    if (!conversation) return;

    // Clear current messages
    this.messagesContainer.innerHTML = '';

    // Load all messages
    for (const message of conversation.messages) {
      this.addMessage(message);
    }

    cometx.setCurrentConversation(conversationId);
  }
}
