import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Terminal from './pages/Terminal';
import CodeEditor from './pages/CodeEditor';
import AppFactory from './pages/AppFactory';
import Orchestrator from './pages/Orchestrator';
import './i18n/config';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <Chat />;
      case 'terminal':
        return <Terminal />;
      case 'editor':
        return <CodeEditor />;
      case 'factory':
        return <AppFactory />;
      case 'orchestrator':
        return <Orchestrator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;

