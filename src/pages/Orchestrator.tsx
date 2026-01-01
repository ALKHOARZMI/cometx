import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Square, RotateCw, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  cpu: string;
  memory: string;
}

const Orchestrator: React.FC = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([
    {
      id: 'ai-engine',
      name: 'AI Engine',
      description: 'Local AI processing service',
      status: 'running',
      uptime: '2h 34m',
      cpu: '15%',
      memory: '2.3 GB',
    },
    {
      id: 'data-processor',
      name: 'Data Processor',
      description: 'Data transformation pipeline',
      status: 'running',
      uptime: '2h 34m',
      cpu: '5%',
      memory: '512 MB',
    },
    {
      id: 'model-cache',
      name: 'Model Cache',
      description: 'AI model caching service',
      status: 'stopped',
      uptime: '-',
      cpu: '0%',
      memory: '0 MB',
    },
    {
      id: 'backup-service',
      name: 'Backup Service',
      description: 'Automated backup and recovery',
      status: 'running',
      uptime: '1h 12m',
      cpu: '2%',
      memory: '256 MB',
    },
  ]);

  const handleStart = (id: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, status: 'running', uptime: '0m' }
          : service
      )
    );
  };

  const handleStop = (id: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, status: 'stopped', uptime: '-', cpu: '0%', memory: '0 MB' }
          : service
      )
    );
  };

  const handleRestart = (id: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, status: 'running', uptime: '0m' }
          : service
      )
    );
  };

  const getStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="text-neon-green-400" size={20} />;
      case 'stopped':
        return <Square className="text-gray-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'running':
        return 'bg-neon-green-500/20 text-neon-green-400 border-neon-green-500/50';
      case 'stopped':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  const runningCount = services.filter((s) => s.status === 'running').length;
  const stoppedCount = services.filter((s) => s.status === 'stopped').length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold neon-text">{t('orchestrator.title')}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-neon-green-500/20 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <Activity className="text-neon-green-400" size={32} />
            <div>
              <p className="text-sm text-gray-400">{t('orchestrator.services')}</p>
              <p className="text-2xl font-bold text-neon-green-400">{services.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-neon-green-500/20 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <CheckCircle className="text-neon-green-400" size={32} />
            <div>
              <p className="text-sm text-gray-400">Running</p>
              <p className="text-2xl font-bold text-neon-green-400">{runningCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-neon-green-500/20 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <Square className="text-gray-500" size={32} />
            <div>
              <p className="text-sm text-gray-400">Stopped</p>
              <p className="text-2xl font-bold text-gray-400">{stoppedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-gray-900 border border-neon-green-500/20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-950 border-b border-neon-green-500/20">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neon-green-400">
                Service
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neon-green-400">
                {t('orchestrator.status')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neon-green-400">
                Uptime
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neon-green-400">
                CPU
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neon-green-400">
                Memory
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neon-green-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-b border-neon-green-500/10 hover:bg-neon-green-500/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-100">{service.name}</p>
                    <p className="text-sm text-gray-400">{service.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    <span className="text-sm font-medium capitalize">{service.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{service.uptime}</td>
                <td className="px-6 py-4 text-gray-300">{service.cpu}</td>
                <td className="px-6 py-4 text-gray-300">{service.memory}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {service.status !== 'running' && (
                      <button
                        onClick={() => handleStart(service.id)}
                        className="p-2 text-neon-green-400 hover:bg-neon-green-500/10 rounded transition-colors"
                        title={t('orchestrator.start')}
                      >
                        <Play size={16} />
                      </button>
                    )}
                    {service.status === 'running' && (
                      <>
                        <button
                          onClick={() => handleStop(service.id)}
                          className="p-2 text-gray-400 hover:bg-gray-500/10 rounded transition-colors"
                          title={t('orchestrator.stop')}
                        >
                          <Square size={16} />
                        </button>
                        <button
                          onClick={() => handleRestart(service.id)}
                          className="p-2 text-neon-green-400 hover:bg-neon-green-500/10 rounded transition-colors"
                          title={t('orchestrator.restart')}
                        >
                          <RotateCw size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orchestrator;
