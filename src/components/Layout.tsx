import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  MessageSquare,
  Terminal as TerminalIcon,
  Code2,
  Factory,
  Workflow,
  Languages,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    setIsRTL(newLang === 'ar');
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { id: 'chat', icon: MessageSquare, label: t('nav.chat') },
    { id: 'terminal', icon: TerminalIcon, label: t('nav.terminal') },
    { id: 'editor', icon: Code2, label: t('nav.editor') },
    { id: 'factory', icon: Factory, label: t('nav.factory') },
    { id: 'orchestrator', icon: Workflow, label: t('nav.orchestrator') },
  ];

  return (
    <div className={`flex h-screen bg-gray-950 text-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-neon-green-500/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-neon-green-500/20">
          <h1 className="text-2xl font-bold neon-text flex items-center gap-2">
            <div className="w-8 h-8 bg-neon-green-500/20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-neon-green-500 rounded-sm animate-pulse"></div>
            </div>
            CometX
          </h1>
          <p className="text-xs text-gray-400 mt-1">{t('chat.localAI')}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentPage === item.id
                  ? 'bg-neon-green-500/20 text-neon-green-400 border border-neon-green-500/50 shadow-neon-sm'
                  : 'text-gray-400 hover:text-neon-green-400 hover:bg-neon-green-500/10'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Language Toggle */}
        <div className="p-4 border-t border-neon-green-500/20">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-neon-green-400 hover:bg-neon-green-500/10 transition-all duration-300"
          >
            <Languages size={20} />
            <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
