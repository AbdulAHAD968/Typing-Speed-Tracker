'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-peach-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-7xl mx-auto text-center px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 mb-6">
            Improve Your Typing Speed
          </h1>
          <p className="text-xl text-brown-700 mb-8 max-w-3xl mx-auto">
            Track your progress, challenge yourself, and become a typing master with our simple yet powerful typing speed tracker.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/typing-test"
              className="bg-coffee-600 hover:bg-coffee-700 text-peach-100 font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Start Typing Test
            </Link>
            <Link
              href="/stats"
              className="bg-peach-100 hover:bg-peach-200 text-coffee-700 font-semibold py-3 px-6 rounded-lg border border-coffee-600 transition duration-300"
            >
              View Stats
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-peach-50 p-6 rounded-lg shadow-md border border-peach-200">
            <div className="w-12 h-12 bg-peach-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coffee-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brown-800">Track Progress</h3>
            <p className="text-brown-600">Monitor your typing speed and accuracy over time with detailed statistics.</p>
          </div>

          <div className="bg-peach-50 p-6 rounded-lg shadow-md border border-peach-200">
            <div className="w-12 h-12 bg-peach-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coffee-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brown-800">Improve Speed</h3>
            <p className="text-brown-600">Regular practice with our typing tests will help you increase your words per minute.</p>
          </div>

          <div className="bg-peach-50 p-6 rounded-lg shadow-md border border-peach-200">
            <div className="w-12 h-12 bg-peach-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coffee-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brown-800">View Statistics</h3>
            <p className="text-brown-600">Analyze your performance with detailed charts and progress tracking.</p>
          </div>
        </div>

        <div className="bg-peach-50 p-8 rounded-lg shadow-md border border-peach-200 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-brown-800">How It Works</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <div className="bg-peach-200 text-coffee-800 font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-brown-800">Create an Account</h3>
                <p className="text-brown-600">Register to save your progress and access your typing statistics.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-peach-200 text-coffee-800 font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-brown-800">Take Typing Tests</h3>
                <p className="text-brown-600">Practice with our typing tests to improve your speed and accuracy.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-peach-200 text-coffee-800 font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-brown-800">Track Your Progress</h3>
                <p className="text-brown-600">Monitor your improvement over time with detailed statistics and charts.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-brown-600 mb-4">Ready to improve your typing skills?</p>
          <Link
            href="/register"
            className="inline-block bg-coffee-600 hover:bg-coffee-700 text-peach-100 font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Custom style for peach and coffee theme */}
      <style jsx>{`
        .bg-peach-50 { background-color: #FFF5EB; }
        .bg-peach-100 { background-color: #FFE8D6; }
        .bg-peach-200 { background-color: #FEDEC8; }
        .border-peach-200 { border-color: #FEDEC8; }
        .text-brown-600 { color: #6B554A; }
        .text-brown-700 { color: #5C4B41; }
        .text-brown-800 { color: #4A3C34; }
        .text-brown-900 { color: #3A2E28; }
        .bg-coffee-600 { background-color: #8B5E3C; }
        .bg-coffee-700 { background-color: #754C29; }
        .text-coffee-600 { color: #8B5E3C; }
        .text-coffee-700 { color: #754C29; }
        .text-coffee-800 { color: #5C3D27; }
        .bg-amber-100 { background-color: #FEF3C7; }
      `}</style>
    </div>
  );
}