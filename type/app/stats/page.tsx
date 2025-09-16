"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("all");
  const [visibleCount, setVisibleCount] = useState(5);

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
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = (results: TestResult[]) => {
    const now = new Date();
    switch (timeFilter) {
      case "week":
        return results.filter((result) => {
          const resultDate = new Date(result.createdAt);
          return (now.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;
        });
      case "month":
        return results.filter((result) => {
          const resultDate = new Date(result.createdAt);
          return (now.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        });
      default:
        return results;
    }
  };

  const filteredResults = filterResults(results);

  const chartData = filteredResults.map((result, index) => ({
    test: index + 1,
    wpm: result.wpm,
    accuracy: result.accuracy,
    time: result.time,
    date: new Date(result.createdAt).toLocaleDateString(),
  }));

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

      {/* Filter Buttons */}
      <div className="flex justify-center mb-8 space-x-4">
        {["all", "month", "week"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setTimeFilter(filter as "all" | "week" | "month");
              setVisibleCount(5); // reset visible count on filter change
            }}
            className={`px-4 py-2 rounded-lg ${
              timeFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {filter === "all"
              ? "All Time"
              : filter === "month"
              ? "Last 30 Days"
              : "Last 7 Days"}
          </button>
        ))}
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
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {Math.round(
                  filteredResults.reduce((sum, r) => sum + r.wpm, 0) /
                    filteredResults.length
                )}
              </div>
              <div className="text-gray-600">Average WPM</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {Math.round(
                  filteredResults.reduce((sum, r) => sum + r.accuracy, 0) /
                    filteredResults.length
                )}
                %
              </div>
              <div className="text-gray-600">Average Accuracy</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {Math.round(
                  filteredResults.reduce((sum, r) => sum + r.time, 0) /
                    filteredResults.length
                )}
                s
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

          {/* WPM & Accuracy Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-12 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) =>
                    name === "wpm"
                      ? [`${value} WPM`, "Words Per Minute"]
                      : [`${value}%`, "Accuracy"]
                  }
                  labelFormatter={(label) =>
                    `Test ${label} (${chartData[label - 1]?.date})`
                  }
                />
                <Legend />
                <Line type="monotone" dataKey="wpm" stroke="#2563EB" />
                <Line type="monotone" dataKey="accuracy" stroke="#16A34A" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Time Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-12 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value}s`, "Time"]}
                  labelFormatter={(label) =>
                    `Test ${label} (${chartData[label - 1]?.date})`
                  }
                />
                <Legend />
                <Bar dataKey="time" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Tests Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WPM
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredResults.slice(0, visibleCount).map((result) => (
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

            {filteredResults.length > visibleCount && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Show More
                </button>
              </div>
            )}
            {visibleCount > 5 && (
              <div className="text-center mt-2">
                <button
                  onClick={() => setVisibleCount(5)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
