'use client';

import { useState, useEffect } from 'react';

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

  if (loading) {
    return <div className="text-center text-coffee-700">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-coffee-800">Your Typing Statistics</h1>
      
      {results.length === 0 ? (
        <p className="text-coffee-600">
          No test results yet. Complete a typing test to see your statistics.
        </p>
      ) : (
        <div>
          {/* Recent Tests Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-coffee-700">Recent Tests</h2>
            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="min-w-full bg-peach-50 border border-peach-200">
                <thead className="bg-gradient-to-r from-peach-400 to-peach-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">WPM</th>
                    <th className="px-4 py-2 text-left">Accuracy</th>
                    <th className="px-4 py-2 text-left">Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result._id} className="odd:bg-white even:bg-peach-100/60">
                      <td className="px-4 py-2 border-b border-peach-200 text-coffee-800">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b border-peach-200 text-coffee-800">
                        {result.wpm}
                      </td>
                      <td className="px-4 py-2 border-b border-peach-200 text-coffee-800">
                        {result.accuracy}%
                      </td>
                      <td className="px-4 py-2 border-b border-peach-200 text-coffee-800">
                        {result.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Progress Overview Cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-coffee-700">Progress Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-peach-400 to-peach-600 text-white p-4 rounded-xl shadow-md">
                <h3 className="font-semibold">Average WPM</h3>
                <p className="text-2xl">
                  {Math.round(results.reduce((sum, result) => sum + result.wpm, 0) / results.length)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-coffee-600 to-coffee-800 text-peach-100 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold">Average Accuracy</h3>
                <p className="text-2xl">
                  {Math.round(results.reduce((sum, result) => sum + result.accuracy, 0) / results.length)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-peach-200 to-peach-400 text-coffee-900 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold">Total Tests</h3>
                <p className="text-2xl">{results.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
