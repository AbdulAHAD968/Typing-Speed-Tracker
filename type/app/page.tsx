'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-peach-50 via-amber-100 to-peach-200 py-16 px-6">
      <div className="w-full max-w-7xl mx-auto text-center space-y-16">
        
        {/* Hero Section */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-brown-900">
            Improve Your <span className="text-coffee-600">Typing Speed</span>
          </h1>
          <p className="text-lg md:text-xl text-brown-700 max-w-3xl mx-auto">
            Track your progress, challenge yourself, and become a typing master with our beautiful, modern typing speed tracker.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/typing-test"
              className="bg-coffee-600 hover:bg-coffee-700 text-peach-100 font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              Start Typing Test
            </Link>
            <Link
              href="/stats"
              className="bg-peach-100 hover:bg-peach-200 text-coffee-700 font-semibold py-3 px-8 rounded-xl border border-coffee-600 shadow-sm hover:shadow-md transition"
            >
              View Stats
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Track Progress",
              desc: "Monitor your typing speed and accuracy over time with detailed statistics.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )
            },
            {
              title: "Improve Speed",
              desc: "Regular practice with our typing tests will help you increase your words per minute.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              )
            },
            {
              title: "View Statistics",
              desc: "Analyze your performance with charts and detailed progress tracking.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              )
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="bg-peach-50 p-8 rounded-2xl shadow-md border border-peach-200 hover:shadow-lg transition"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-14 h-14 bg-peach-200 rounded-full flex items-center justify-center mb-4 mx-auto shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-coffee-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brown-800">{f.title}</h3>
              <p className="text-brown-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-peach-100 p-10 rounded-2xl shadow-md border border-peach-200 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-brown-900 text-center">How It Works</h2>
          <div className="space-y-6 text-left">
            {[
              { step: "1", title: "Create an Account", desc: "Register to save your progress and access your typing statistics." },
              { step: "2", title: "Take Typing Tests", desc: "Practice with our tests to improve speed and accuracy." },
              { step: "3", title: "Track Your Progress", desc: "See your improvement over time with detailed stats and charts." },
            ].map((s) => (
              <div key={s.step} className="flex items-start">
                <div className="bg-peach-200 text-coffee-800 font-semibold rounded-full w-9 h-9 flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-brown-800">{s.title}</h3>
                  <p className="text-brown-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call To Action */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-brown-600 text-lg">Ready to improve your typing skills?</p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-coffee-600 to-coffee-700 hover:from-coffee-700 hover:to-coffee-800 text-peach-100 font-semibold py-4 px-10 rounded-xl shadow-md hover:shadow-xl transition"
          >
            Get Started Now
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
