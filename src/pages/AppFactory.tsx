import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Rocket, Box, Code, Globe } from 'lucide-react';

interface AppTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  technologies: string[];
}

const AppFactory: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');

  const templates: AppTemplate[] = [
    {
      id: 'react-app',
      name: 'React Application',
      description: 'Modern React app with TypeScript and Vite',
      icon: <Code className="text-neon-green-400" size={32} />,
      technologies: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS'],
    },
    {
      id: 'api-service',
      name: 'API Service',
      description: 'RESTful API service with Node.js',
      icon: <Globe className="text-neon-green-400" size={32} />,
      technologies: ['Node.js', 'Express', 'TypeScript', 'REST API'],
    },
    {
      id: 'ai-module',
      name: 'AI Module',
      description: 'Local-first AI processing module',
      icon: <Rocket className="text-neon-green-400" size={32} />,
      technologies: ['Transformers.js', 'WebAssembly', 'TypeScript'],
    },
    {
      id: 'component-library',
      name: 'Component Library',
      description: 'Reusable UI component library',
      icon: <Box className="text-neon-green-400" size={32} />,
      technologies: ['React', 'TypeScript', 'Storybook', 'CSS'],
    },
  ];

  const handleCreate = () => {
    if (!selectedTemplate || !appName) {
      alert('Please select a template and provide an app name');
      return;
    }

    console.log('Creating app:', {
      template: selectedTemplate,
      name: appName,
      description: appDescription,
    });

    alert(`App "${appName}" created successfully! (This is a demonstration)`);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold neon-text">{t('factory.title')}</h1>
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neon-green-400">
          {t('factory.template')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-6 rounded-lg border transition-all duration-300 text-left ${
                selectedTemplate === template.id
                  ? 'bg-neon-green-500/20 border-neon-green-500 shadow-neon'
                  : 'bg-gray-900 border-neon-green-500/20 hover:border-neon-green-500/50'
              }`}
            >
              <div className="mb-4">{template.icon}</div>
              <h3 className="text-lg font-semibold text-neon-green-400 mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4">{template.description}</p>
              <div className="flex flex-wrap gap-2">
                {template.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-950 text-xs text-neon-green-400 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* App Configuration */}
      <div className="bg-gray-900 border border-neon-green-500/20 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-neon-green-400">App Configuration</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t('factory.name')}
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="my-awesome-app"
            className="w-full bg-gray-950 border border-neon-green-500/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-green-500 focus:shadow-neon-sm transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t('factory.description')}
          </label>
          <textarea
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            placeholder="Describe your application..."
            rows={4}
            className="w-full bg-gray-950 border border-neon-green-500/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-green-500 focus:shadow-neon-sm transition-all duration-300"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={!selectedTemplate || !appName}
          className="btn-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          {t('factory.create')}
        </button>
      </div>
    </div>
  );
};

export default AppFactory;
