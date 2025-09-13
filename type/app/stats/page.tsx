'use client';

import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestResult {
  _id: string;
  wpm: number;
  accuracy: number;
  time: number;
  createdAt: string;
}

export default function Stats() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchResults();
  }, [timeFilter]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/results?filter=${timeFilter}`);
      const data = await response.json();
      
      if (response.ok) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = (results: TestResult[]) => {
    const now = new Date();
    switch (timeFilter) {
      case 'week':
        return results.filter(result => {
          const resultDate = new Date(result.createdAt);
          const diffTime = Math.abs(now.getTime() - resultDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        });
      case 'month':
        return results.filter(result => {
          const resultDate = new Date(result.createdAt);
          const diffTime = Math.abs(now.getTime() - resultDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30;
        });
      default:
        return results;
    }
  };

  const filteredResults = filterResults(results);

  // Prepare data for charts
  const chartData = {
    labels: filteredResults.map((result, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: 'WPM',
        data: filteredResults.map(result => result.wpm),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Accuracy (%)',
        data: filteredResults.map(result => result.accuracy),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const timeData = {
    labels: filteredResults.map((result, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: 'Time (seconds)',
        data: filteredResults.map(result => result.time),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'WPM',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Accuracy (%)',
        },
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Typing Performance Over Time',
      },
    },
  };

  const timeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Time Taken for Each Test',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Time (seconds)',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Typing Statistics</h1>
      
      {/* Filter buttons */}
      <div className="flex justify-center mb-8 space-x-4">
        <button
          onClick={() => setTimeFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            timeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setTimeFilter('month')}
          className={`px-4 py-2 rounded-lg ${
            timeFilter === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => setTimeFilter('week')}
          className={`px-4 py-2 rounded-lg ${
            timeFilter === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Last 7 Days
        </button>
      </div>

      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold mb-4">No test results yet</h2>
          <p className="text-gray-600 mb-6">
            Complete a typing test to see your statistics and track your progress.
          </p>
          <a
            href="/typing-test"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Take a Typing Test
          </a>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {Math.round(filteredResults.reduce((sum, result) => sum + result.wpm, 0) / filteredResults.length)}
              </div>
              <div className="text-gray-600">Average WPM</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {Math.round(filteredResults.reduce((sum, result) => sum + result.accuracy, 0) / filteredResults.length)}%
              </div>
              <div className="text-gray-600">Average Accuracy</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {Math.round(filteredResults.reduce((sum, result) => sum + result.time, 0) / filteredResults.length)}s
              </div>
              <div className="text-gray-600">Average Time</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {filteredResults.length}
              </div>
              <div className="text-gray-600">Total Tests</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Line data={chartData} options={chartOptions} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Bar data={timeData} options={timeChartOptions} />
            </div>
          </div>

          {/* Recent Tests Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WPM</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredResults.map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Date(result.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(result.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {result.wpm} WPM
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {result.accuracy}%
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {result.time}s
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4">Progress Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Best Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Highest WPM:</span>
                    <span className="font-semibold text-blue-600">
                      {Math.max(...filteredResults.map(r => r.wpm))} WPM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Accuracy:</span>
                    <span className="font-semibold text-green-600">
                      {Math.max(...filteredResults.map(r => r.accuracy))}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Consistency</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tests this week:</span>
                    <span className="font-semibold">
                      {filterResults(results.filter(r => {
                        const resultDate = new Date(r.createdAt);
                        const diffTime = Math.abs(Date.now() - resultDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays <= 7;
                      })).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Improvement trend:</span>
                    <span className="font-semibold text-green-600">
                      {filteredResults.length > 1 ? 
                        (filteredResults[filteredResults.length - 1].wpm > filteredResults[0].wpm ? '↑ Improving' : '→ Steady') 
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}