"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
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

  // Prepare data for Recharts
  const chartData = results.map((result, index) => ({
    test: index + 1,
    wpm: result.wpm,
    accuracy: result.accuracy,
    date: new Date(result.createdAt).toLocaleDateString(),
  }));

  if (loading) {
    return <div className="text-center text-coffee-700 text-lg py-8">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-peach-50 rounded-lg shadow-md border border-peach-200">
      <h1 className="text-3xl font-bold mt-8 mb-10 text-center text-brown-800">Your Typing Statistics</h1>
      
      {results.length === 0 ? (
        <p className="text-coffee-600 text-lg text-center">
          No test results yet. Complete a typing test to see your statistics.
        </p>
      ) : (
        <div>
          {/* Progress Overview Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-coffee-700">Progress Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-peach-400 to-peach-600 text-white p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-sm sm:text-base">Average WPM</h3>
                <p className="text-xl sm:text-2xl">
                  {Math.round(results.reduce((sum, result) => sum + result.wpm, 0) / results.length)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-coffee-600 to-coffee-800 text-peach-100 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-sm sm:text-base">Average Accuracy</h3>
                <p className="text-xl sm:text-2xl">
                  {Math.round(results.reduce((sum, result) => sum + result.accuracy, 0) / results.length)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-peach-200 to-peach-400 text-coffee-900 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-sm sm:text-base">Total Tests</h3>
                <p className="text-xl sm:text-2xl">{results.length}</p>
              </div>
            </div>
          </div>

          {/* WPM Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-coffee-700">WPM Progress</h2>
            <div className="bg-white p-4 rounded-lg border border-peach-300 shadow-md h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="test" 
                    label={{ value: "Test Number", position: "insideBottom", offset: -10 }} 
                    tick={{ fontSize: 12 }}
                    interval={Math.floor(chartData.length / 10)} // Adjust tick frequency for mobile
                  />
                  <YAxis 
                    label={{ value: "WPM", angle: -90, position: "insideLeft", offset: -10 }} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value} ${name === 'wpm' ? 'WPM' : '%'}`, 
                      name === 'wpm' ? 'Words Per Minute' : 'Accuracy',
                    ]}
                    labelFormatter={(label) => `Test ${label} (${chartData[label - 1]?.date})`}
                  />
                  <Bar dataKey="wpm" fill="#8B5E3C" name="WPM" />
                  <Bar dataKey="accuracy" fill="#FDD0B2" name="Accuracy" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-brown-600 mt-2">Test Number (Date)</div>
          </div>

          {/* Recent Tests Table */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-coffee-700">Recent Tests</h2>
            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="min-w-full bg-peach-50 border border-peach-200">
                <thead className="bg-gradient-to-r from-peach-400 to-peach-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm sm:text-base">Date</th>
                    <th className="px-4 py-2 text-left text-sm sm:text-base">WPM</th>
                    <th className="px-4 py-2 text-left text-sm sm:text-base">Accuracy</th>
                    <th className="px-4 py-2 text-left text-sm sm:text-base">Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result._id} className="odd:bg-white even:bg-peach-100/60">
                      <td className="px-4 py-2 border-b border-peach-200 text-coffee-800 text-sm sm:text-base">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b border-peach-200 text-coffee-800 text-sm sm:text-base">
                        {result.wpm}
                      </td>
                      <td className="px-4 py-2 border-b border-peach-200 text-coffee-800 text-sm sm:text-base">
                        {result.accuracy}%
                      </td>
                      <td className="px-4 py-2 border-b border-peach-200 text-coffee-800 text-sm sm:text-base">
                        {result.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bg-peach-50 { background-color: #FFF5EB; }
        .bg-peach-100 { background-color: #FFE8D6; }
        .bg-peach-200 { background-color: #FEDEC8; }
        .bg-peach-400 { background-color: #FDD0B2; }
        .bg-peach-600 { background-color: #FBBF99; }
        .border-peach-200 { border-color: #FEDEC8; }
        .text-coffee-600 { color: #8B5E3C; }
        .text-coffee-700 { color: #754C29; }
        .text-coffee-800 { color: #4A3C34; }
        .text-coffee-900 { color: #3A2E28; }
        .bg-coffee-600 { background-color: #8B5E3C; }
        .bg-coffee-800 { background-color: #5C3D1F; }
        .text-peach-100 { color: #FFE8D6; }
        .text-brown-600 { color: #6B4E31; }
      `}</style>
    </div>
  );
}