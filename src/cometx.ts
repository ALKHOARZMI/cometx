/**
 * CometX Core - Tri-Lobe Architecture Integration
 * Coordinates between Reasoning, Memory, and Execution lobes
 * Privacy-first: All processing happens on-device
 */

import { reasoningLobe, type ModelType } from './lobes/reasoning';
import { memoryLobe, type Conversation, type Message, type UserPreferences } from './lobes/memory';
import { executionLobe, type ExecutionResult } from './lobes/execution';

export interface CometXConfig {
  model?: ModelType;
  language?: 'ar' | 'en';
}

export interface ChatResponse {
  message: Message;
  executionResult?: ExecutionResult;
}

class CometXCore {
  private isInitialized = false;
  private currentConversationId: string | null = null;

  /**
   * Initialize the CometX platform
   */
  async initialize(config: CometXConfig = {}): Promise<void> {
    if (this.isInitialized) {
      console.log('CometX already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing CometX Tri-Lobe Architecture...');

      // Initialize Memory Lobe first
      console.log('📚 Initializing Memory Lobe...');
      await memoryLobe.initialize();

      // Get user preferences
      const preferences = await memoryLobe.getPreferences();
      const modelToUse = config.model || preferences.model;

      // Initialize Reasoning Lobe
      console.log('🧠 Initializing Reasoning Lobe...');
      await reasoningLobe.initialize({ model: modelToUse });

      // Initialize Execution Lobe
      console.log('⚡ Initializing Execution Lobe...');
      await executionLobe.initialize();

      this.isInitialized = true;
      console.log('✅ CometX initialized successfully!');
      console.log('🇸🇦 Sovereign AI ready - All processing on-device');
    } catch (error) {
      console.error('❌ Failed to initialize CometX:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(title?: string): Promise<Conversation> {
    if (!this.isInitialized) {
      throw new Error('CometX not initialized');
    }

    const conversation: Conversation = {
      id: this.generateId(),
      title: title || 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await memoryLobe.saveConversation(conversation);
    this.currentConversationId = conversation.id;

    return conversation;
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(
    content: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    if (!this.isInitialized) {
      throw new Error('CometX not initialized');
    }

    const convId = conversationId || this.currentConversationId;
    if (!convId) {
      throw new Error('No active conversation');
    }

    // Create user message
    const userMessage: Message = {
      id: this.generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    await memoryLobe.addMessage(convId, userMessage);

    // Check if this is a code execution request
    const executionResult = await this.tryExecuteCode(content);

    // Generate AI response
    const response = await reasoningLobe.generate(content, {
      systemPrompt: this.getSystemPrompt(executionResult),
      maxLength: 512,
    });

    // Create assistant message
    const assistantMessage: Message = {
      id: this.generateId(),
      role: 'assistant',
      content: response.text,
      timestamp: Date.now(),
      model: response.model,
    };

    await memoryLobe.addMessage(convId, assistantMessage);

    return {
      message: assistantMessage,
      executionResult,
    };
  }

  /**
   * Try to execute code if the message contains code
   */
  private async tryExecuteCode(content: string): Promise<ExecutionResult | undefined> {
    // Check for code execution patterns
    const codePatterns = [
      /```(?:javascript|js)?\s*([\s\S]*?)```/,
      /eval\((.*?)\)/,
      /calculate\s*:?\s*(.*)/i,
      /compute\s*:?\s*(.*)/i,
    ];

    for (const pattern of codePatterns) {
      const match = content.match(pattern);
      if (match) {
        const code = match[1]?.trim();
        if (code) {
          try {
            return await executionLobe.execute(code);
          } catch (error) {
            console.error('Execution failed:', error);
          }
        }
      }
    }

    return undefined;
  }

  /**
   * Get system prompt based on execution result
   */
  private getSystemPrompt(executionResult?: ExecutionResult): string {
    let prompt = `You are CometX, a sovereign AI assistant running 100% locally on the user's device. You respect privacy and never send data to external servers. You support both Arabic (العربية) and English languages.`;

    if (executionResult) {
      prompt += `\n\nCode execution result:\n`;
      if (executionResult.success) {
        prompt += `Result: ${JSON.stringify(executionResult.result)}\n`;
      } else {
        prompt += `Error: ${executionResult.error}\n`;
      }
      if (executionResult.logs && executionResult.logs.length > 0) {
        prompt += `Logs:\n${executionResult.logs.join('\n')}`;
      }
    }

    return prompt;
  }

  /**
   * Get all conversations
   */
  async getConversations(): Promise<Conversation[]> {
    if (!this.isInitialized) {
      throw new Error('CometX not initialized');
    }

    return await memoryLobe.getAllConversations();
  }

  /**
   * Get a specific conversation
   */
  async getConversation(id: string): Promise<Conversation | undefined> {
    if (!this.isInitialized) {
      throw new Error('CometX not initialized');
    }

    return await memoryLobe.getConversation(id);
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('CometX not initialized');
    }

    await memoryLobe.deleteConversation(id);

    if (this.currentConversationId === id) {
      this.currentConversationId = null;
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    if (!this.isInitialized) {
      throw new Error('CometX not initialized');
    }

    return await memoryLobe.getPreferences();
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('CometX not initialized');
    }

    const current = await memoryLobe.getPreferences();
    const updated = { ...current, ...preferences };
    await memoryLobe.savePreferences(updated);

    // Reinitialize reasoning lobe if model changed
    if (preferences.model && preferences.model !== current.model) {
      await reasoningLobe.initialize({ model: preferences.model });
    }
  }

  /**
   * Clear all data (privacy feature)
   */
  async clearAllData(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('CometX not initialized');
    }

    await memoryLobe.clearAllData();
    this.currentConversationId = null;
    console.log('🗑️ All data cleared - Privacy maintained');
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get initialization status
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Set current conversation
   */
  setCurrentConversation(id: string): void {
    this.currentConversationId = id;
  }

  /**
   * Get current conversation ID
   */
  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }
}

// Export singleton instance
export const cometx = new CometXCore();
