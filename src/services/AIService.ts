import { pipeline } from '@xenova/transformers';

// Type definition for the AI model
interface TextGenerationModel {
  (text: string, options?: any): Promise<any>;
}

class AIService {
  private static instance: AIService;
  private model: TextGenerationModel | null = null;
  private isLoading: boolean = false;
  private isReady: boolean = false;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isReady || this.isLoading) {
      return;
    }

    this.isLoading = true;
    try {
      // Using text-generation pipeline with a lightweight model
      // Note: Phi-3-mini would require significant resources, so we use a smaller model for demo
      this.model = await pipeline('text-generation', 'Xenova/gpt2');
      this.isReady = true;
      console.log('AI model loaded successfully');
    } catch (error) {
      console.error('Failed to load AI model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async generate(prompt: string, maxLength: number = 100): Promise<string> {
    if (!this.isReady || !this.model) {
      throw new Error('AI model is not ready. Please initialize first.');
    }

    try {
      const result = await this.model(prompt, {
        max_new_tokens: maxLength,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
      });

      if (Array.isArray(result) && result.length > 0) {
        return result[0].generated_text || '';
      }

      return '';
    } catch (error) {
      console.error('Text generation failed:', error);
      throw error;
    }
  }

  getStatus(): { isLoading: boolean; isReady: boolean } {
    return {
      isLoading: this.isLoading,
      isReady: this.isReady,
    };
  }
}

export default AIService;
