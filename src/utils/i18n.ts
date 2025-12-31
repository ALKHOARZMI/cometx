/**
 * UI Utilities for CometX
 * Handles RTL support and Arabic/English language switching
 */

export const translations = {
  en: {
    title: 'CometX - Sovereign AI',
    subtitle: 'Your privacy-first, local AI assistant',
    newChat: 'New Chat',
    send: 'Send',
    clear: 'Clear All Data',
    preferences: 'Preferences',
    language: 'Language',
    theme: 'Theme',
    model: 'Model',
    light: 'Light',
    dark: 'Dark',
    thinking: 'Thinking...',
    executing: 'Executing code...',
    errorTitle: 'Error',
    clearConfirm: 'Are you sure you want to clear all data? This cannot be undone.',
    dashboard: 'Dashboard',
    chat: 'Chat',
    terminal: 'Terminal',
    conversations: 'Conversations',
    noConversations: 'No conversations yet',
    executionResult: 'Execution Result',
    executionTime: 'Execution Time',
    placeholder: 'Type your message... (supports code execution)',
    sovereignty: '🇸🇦 100% Local - Your data never leaves your device',
  },
  ar: {
    title: 'CometX - الذكاء الاصطناعي السيادي',
    subtitle: 'مساعدك الذكي المحلي الذي يحترم خصوصيتك',
    newChat: 'محادثة جديدة',
    send: 'إرسال',
    clear: 'مسح جميع البيانات',
    preferences: 'التفضيلات',
    language: 'اللغة',
    theme: 'المظهر',
    model: 'النموذج',
    light: 'فاتح',
    dark: 'داكن',
    thinking: 'جاري التفكير...',
    executing: 'جاري تنفيذ الكود...',
    errorTitle: 'خطأ',
    clearConfirm: 'هل أنت متأكد من رغبتك في مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.',
    dashboard: 'لوحة التحكم',
    chat: 'المحادثة',
    terminal: 'الطرفية',
    conversations: 'المحادثات',
    noConversations: 'لا توجد محادثات بعد',
    executionResult: 'نتيجة التنفيذ',
    executionTime: 'وقت التنفيذ',
    placeholder: 'اكتب رسالتك... (يدعم تنفيذ الكود)',
    sovereignty: '🇸🇦 محلي 100% - بياناتك لا تغادر جهازك أبداً',
  },
};

export type Language = keyof typeof translations;

export function t(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key];
}

export function applyRTL(isRTL: boolean): void {
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = isRTL ? 'ar' : 'en';
}

export function formatTime(timestamp: number, lang: Language): string {
  const date = new Date(timestamp);
  return date.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US');
}

export function formatExecutionTime(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}
