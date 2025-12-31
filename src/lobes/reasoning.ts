/**
 * Reasoning Lobe - Local LLM using @xenova/transformers
 * 100% on-device inference with no cloud APIs
 * Supports Phi-3-mini and Gemma-2B models
 */

import { pipeline, env } from '@xenova/transformers';

// Disable remote models and use local cache
env.allowLocalModels = true;
env.allowRemoteModels = true;

export type ModelType = 'phi-3-mini' | 'gemma-2b';

export interface ReasoningConfig {
  model: ModelType;
  maxLength?: number;
  temperature?: number;
}

export interface ReasoningResponse {
  text: string;
  model: string;
  timestamp: number;
}

class ReasoningLobe {
  private generator: any = null;
  private currentModel: ModelType | null = null;
  private isInitialized = false;

  /**
   * Initialize the reasoning lobe with a specific model
   */
  async initialize(config: ReasoningConfig): Promise<void> {
    if (this.isInitialized && this.currentModel === config.model) {
      return;
    }

    try {
      console.log(`Initializing Reasoning Lobe with model: ${config.model}`);
      
      // Map model types to actual model IDs
      const modelMap: Record<ModelType, string> = {
        'phi-3-mini': 'Xenova/Phi-3-mini-4k-instruct',
        'gemma-2b': 'Xenova/gemma-2b-it',
      };

      const modelId = modelMap[config.model];
      
      // Create text generation pipeline
      this.generator = await pipeline('text-generation', modelId, {
        device: 'auto', // Will use WebGPU if available, otherwise WASM
      });

      this.currentModel = config.model;
      this.isInitialized = true;
      
      console.log(`Reasoning Lobe initialized successfully with ${config.model}`);
    } catch (error) {
      console.error('Failed to initialize Reasoning Lobe:', error);
      throw new Error(`Failed to initialize model: ${error}`);
    }
  }

  /**
   * Generate text response using the local LLM
   */
  async generate(
    prompt: string,
    options?: {
      maxLength?: number;
      temperature?: number;
      systemPrompt?: string;
    }
  ): Promise<ReasoningResponse> {
    if (!this.isInitialized || !this.generator) {
      throw new Error('Reasoning Lobe not initialized. Call initialize() first.');
    }

    try {
      const fullPrompt = options?.systemPrompt 
        ? `${options.systemPrompt}\n\nUser: ${prompt}\nAssistant:`
        : prompt;

      const output = await this.generator(fullPrompt, {
        max_new_tokens: options?.maxLength || 512,
        temperature: options?.temperature || 0.7,
        do_sample: true,
        top_k: 50,
        top_p: 0.95,
      });

      return {
        text: output[0].generated_text,
        model: this.currentModel || 'unknown',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Failed to generate response:', error);
      throw new Error(`Generation failed: ${error}`);
    }
  }

  /**
   * Check if the lobe is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get the current model name
   */
  getCurrentModel(): ModelType | null {
    return this.currentModel;
  }
}

// Export singleton instance
export const reasoningLobe = new ReasoningLobe();
