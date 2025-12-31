import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import { Play, Save, FileCode } from 'lucide-react';

const CodeEditor: React.FC = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(`// Welcome to CometX Code Editor
// This is a fully featured Monaco editor running locally

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate fibonacci sequence
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}
`);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    setOutput('');
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      };

      // SECURITY NOTE: eval() is used here for demonstration purposes only.
      // In a production environment, use a sandboxed execution environment
      // such as Web Workers or an iframe with proper restrictions.
      // This implementation should only be used with trusted code.
      eval(code);

      console.log = originalLog;
      setOutput(logs.join('\n') || 'Code executed successfully');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <div className="border-b border-neon-green-500/20 p-6 bg-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold neon-text">{t('editor.title')}</h1>
          <div className="flex gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-950 border border-neon-green-500/30 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-neon-green-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <button onClick={handleSave} className="btn-neon flex items-center gap-2">
              <Save size={16} />
              {t('editor.save')}
            </button>
            <button onClick={handleRun} className="btn-neon flex items-center gap-2">
              <Play size={16} />
              {t('editor.run')}
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Code Editor */}
        <div className="flex-1 border-r border-neon-green-500/20">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderWhitespace: 'selection',
              tabSize: 2,
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="lg:w-96 bg-gray-900 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="text-neon-green-400" size={20} />
            <h2 className="text-lg font-semibold text-neon-green-400">Output</h2>
          </div>
          <div className="flex-1 bg-gray-950 border border-neon-green-500/20 rounded-lg p-4 font-mono text-sm">
            {output ? (
              <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-gray-500">Run code to see output...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
