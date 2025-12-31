import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Trash2, Loader2, ShieldCheck } from 'lucide-react';
import AIService from '../services/AIService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = useRef(AIService.getInstance());

  useEffect(() => {
    initializeAI();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeAI = async () => {
    try {
      await aiService.current.initialize();
      setModelStatus('ready');
      addMessage('assistant', t('chat.modelReady'));
    } catch (error) {
      setModelStatus('error');
      addMessage('assistant', 'Failed to initialize AI model. Please refresh the page.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing || modelStatus !== 'ready') return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsProcessing(true);

    try {
      const response = await aiService.current.generate(userMessage, 150);
      addMessage('assistant', response);
    } catch (error) {
      addMessage('assistant', 'Sorry, I encountered an error processing your request.');
      console.error('AI generation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <div className="border-b border-neon-green-500/20 p-6 bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold neon-text">{t('chat.title')}</h1>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck size={16} className="text-neon-green-500" />
              <p className="text-sm text-gray-400">{t('chat.localAI')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              modelStatus === 'ready'
                ? 'bg-neon-green-500/20 text-neon-green-400'
                : modelStatus === 'loading'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {modelStatus === 'loading' && t('chat.modelLoading')}
              {modelStatus === 'ready' && t('chat.modelReady')}
              {modelStatus === 'error' && t('common.error')}
            </div>
            <button
              onClick={handleClear}
              className="btn-neon flex items-center gap-2"
              disabled={messages.length === 0}
            >
              <Trash2 size={16} />
              {t('chat.clear')}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-neon-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 bg-neon-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-400">{t('chat.placeholder')}</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-6 py-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-neon-green-500/20 border border-neon-green-500/50'
                  : 'bg-gray-900 border border-neon-green-500/20'
              }`}
            >
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-neon-green-500/20 px-6 py-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-neon-green-400" size={16} />
                <p className="text-sm text-gray-400">{t('chat.processing')}</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neon-green-500/20 p-6 bg-gray-900">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.placeholder')}
            disabled={modelStatus !== 'ready' || isProcessing}
            className="flex-1 bg-gray-950 border border-neon-green-500/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-green-500 focus:shadow-neon-sm transition-all duration-300"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || modelStatus !== 'ready' || isProcessing}
            className="btn-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            {t('chat.send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
