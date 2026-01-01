import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Activity, Cpu, HardDrive, Zap } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [cpuData, setCpuData] = useState<number[]>([]);
  const [memoryData, setMemoryData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const cpu = Math.random() * 100;
      const memory = Math.random() * 100;

      setLabels((prev) => [...prev.slice(-9), now]);
      setCpuData((prev) => [...prev.slice(-9), cpu]);
      setMemoryData((prev) => [...prev.slice(-9), memory]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: t('dashboard.cpuUsage'),
        data: cpuData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: t('dashboard.memoryUsage'),
        data: memoryData,
        borderColor: 'rgb(74, 222, 128)',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(74, 222, 128, 0.1)' },
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(74, 222, 128, 0.1)' },
      },
    },
  };

  const doughnutData = {
    labels: ['Used', 'Available'],
    datasets: [
      {
        data: [cpuData[cpuData.length - 1] || 0, 100 - (cpuData[cpuData.length - 1] || 0)],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(31, 41, 55, 0.8)'],
        borderColor: ['rgb(16, 185, 129)', 'rgb(31, 41, 55)'],
        borderWidth: 2,
      },
    ],
  };

  const stats = [
    {
      icon: Cpu,
      label: t('dashboard.cpuUsage'),
      value: `${(cpuData[cpuData.length - 1] || 0).toFixed(1)}%`,
      color: 'text-neon-green-400',
    },
    {
      icon: HardDrive,
      label: t('dashboard.memoryUsage'),
      value: `${(memoryData[memoryData.length - 1] || 0).toFixed(1)}%`,
      color: 'text-neon-green-500',
    },
    {
      icon: Activity,
      label: t('dashboard.modelStatus'),
      value: t('chat.modelReady'),
      color: 'text-neon-green-600',
    },
    {
      icon: Zap,
      label: t('dashboard.activeProcesses'),
      value: '4',
      color: 'text-neon-green-400',
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold neon-text">{t('dashboard.title')}</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-neon-green-500/20 rounded-lg p-6 hover:border-neon-green-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neon-green-500/10 rounded-lg">
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-neon-green-400">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-neon-green-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neon-green-400 mb-4">
            {t('dashboard.performanceChart')}
          </h2>
          <div className="h-80">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-gray-900 border border-neon-green-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neon-green-400 mb-4">
            {t('dashboard.cpuUsage')}
          </h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ ...chartOptions, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
