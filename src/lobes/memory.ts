/**
 * Memory Lobe - Persistent local storage using localStorage and IndexedDB
 * Stores conversation history and user data locally only
 * Privacy-first: no data leaves the device
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  model: 'phi-3-mini' | 'gemma-2b';
  rtl: boolean;
}

interface CometXDB extends DBSchema {
  conversations: {
    key: string;
    value: Conversation;
    indexes: { 'by-date': number };
  };
  messages: {
    key: string;
    value: Message;
    indexes: { 'by-conversation': string; 'by-timestamp': number };
  };
  preferences: {
    key: string;
    value: any;
  };
}

class MemoryLobe {
  private db: IDBPDatabase<CometXDB> | null = null;
  private readonly DB_NAME = 'cometx-sovereign-db';
  private readonly DB_VERSION = 1;

  /**
   * Initialize the memory lobe
   */
  async initialize(): Promise<void> {
    try {
      this.db = await openDB<CometXDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // Create conversations store
          if (!db.objectStoreNames.contains('conversations')) {
            const conversationStore = db.createObjectStore('conversations', {
              keyPath: 'id',
            });
            conversationStore.createIndex('by-date', 'updatedAt');
          }

          // Create messages store
          if (!db.objectStoreNames.contains('messages')) {
            const messageStore = db.createObjectStore('messages', {
              keyPath: 'id',
            });
            messageStore.createIndex('by-conversation', 'conversationId');
            messageStore.createIndex('by-timestamp', 'timestamp');
          }

          // Create preferences store
          if (!db.objectStoreNames.contains('preferences')) {
            db.createObjectStore('preferences', { keyPath: 'key' });
          }
        },
      });

      console.log('Memory Lobe initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Memory Lobe:', error);
      throw new Error(`Failed to initialize database: ${error}`);
    }
  }

  /**
   * Save a conversation
   */
  async saveConversation(conversation: Conversation): Promise<void> {
    if (!this.db) throw new Error('Memory Lobe not initialized');
    
    try {
      await this.db.put('conversations', conversation);
    } catch (error) {
      console.error('Failed to save conversation:', error);
      throw error;
    }
  }

  /**
   * Get a conversation by ID
   */
  async getConversation(id: string): Promise<Conversation | undefined> {
    if (!this.db) throw new Error('Memory Lobe not initialized');
    
    try {
      return await this.db.get('conversations', id);
    } catch (error) {
      console.error('Failed to get conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations
   */
  async getAllConversations(): Promise<Conversation[]> {
    if (!this.db) throw new Error('Memory Lobe not initialized');
    
    try {
      const conversations = await this.db.getAllFromIndex(
        'conversations',
        'by-date'
      );
      return conversations.reverse(); // Most recent first
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    if (!this.db) throw new Error('Memory Lobe not initialized');
    
    try {
      await this.db.delete('conversations', id);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  }

  /**
   * Save a message to a conversation
   */
  async addMessage(conversationId: string, message: Message): Promise<void> {
    if (!this.db) throw new Error('Memory Lobe not initialized');
    
    try {
      // Get conversation
      const conversation = await this.getConversation(conversationId);
      if (!conversation) {
        throw new Error(`Conversation ${conversationId} not found`);
      }

      // Add message to conversation
      conversation.messages.push(message);
      conversation.updatedAt = Date.now();

      // Save updated conversation
      await this.saveConversation(conversation);
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    if (!this.db) throw new Error('Memory Lobe not initialized');
    
    try {
      const prefs = await this.db.get('preferences', 'user-preferences');
      return prefs?.value || this.getDefaultPreferences();
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Save user preferences
   */
  async savePreferences(preferences: UserPreferences): Promise<void> {
    if (!this.db) throw new Error('Memory Lobe not initialized');
    
    try {
      await this.db.put('preferences', {
        key: 'user-preferences',
        value: preferences,
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw error;
    }
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'en',
      theme: 'light',
      model: 'phi-3-mini',
      rtl: false,
    };
  }

  /**
   * Clear all data (for privacy)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Memory Lobe not initialized');
    
    try {
      await this.db.clear('conversations');
      await this.db.clear('messages');
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const memoryLobe = new MemoryLobe();
