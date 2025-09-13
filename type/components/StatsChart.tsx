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
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Typing Statistics</h1>
      
      {results.length === 0 ? (
        <p>No test results yet. Complete a typing test to see your statistics.</p>
      ) : (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">WPM</th>
                    <th className="px-4 py-2 border-b">Accuracy</th>
                    <th className="px-4 py-2 border-b">Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result._id}>
                      <td className="px-4 py-2 border-b">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b">{result.wpm}</td>
                      <td className="px-4 py-2 border-b">{result.accuracy}%</td>
                      <td className="px-4 py-2 border-b">{result.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold">Average WPM</h3>
                <p className="text-2xl">
                  {Math.round(results.reduce((sum, result) => sum + result.wpm, 0) / results.length)}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="font-semibold">Average Accuracy</h3>
                <p className="text-2xl">
                  {Math.round(results.reduce((sum, result) => sum + result.accuracy, 0) / results.length)}%
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
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