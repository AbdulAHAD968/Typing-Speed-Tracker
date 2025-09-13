'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success animation before redirect
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } else {
        setError(data.error);
        setIsLoading(false);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-peach-50 to-amber-100">
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl animate-fade-in">
        {/* Left side - Illustration/Info */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-coffee-800 to-coffee-900 text-white p-8 flex flex-col justify-center">
          <div className="text-center mb-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="text-5xl mb-4">⌨️</div>
            <h2 className="text-2xl font-bold">Join Typing Master</h2>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-start">
              <div className="bg-amber-300 text-coffee-900 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-amber-100">Track your typing progress over time</p>
            </div>
            
            <div className="flex items-start">
              <div className="bg-amber-300 text-coffee-900 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-amber-100">Compete with other typists</p>
            </div>
            
            <div className="flex items-start">
              <div className="bg-amber-300 text-coffee-900 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-amber-100">Personalized practice sessions</p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-3/5 bg-white p-8 md:p-10">
          <h1 className="text-3xl font-bold text-coffee-800 mb-2">Create Account</h1>
          <p className="text-brown-700 mb-8">Join our community of typing enthusiasts</p>
          
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 flex items-center animate-shake cursor-pointer">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-brown-800 text-sm font-medium mb-2 cursor-pointer" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    className="w-full p-3 border border-peach-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-all duration-300 bg-peach-50 cursor-pointer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-brown-800 text-sm font-medium mb-2 cursor-pointer" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-peach-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-all duration-300 bg-peach-50 cursor-pointer"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-brown-800 text-sm font-medium mb-2 cursor-pointer" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="w-full p-3 border border-peach-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-all duration-300 bg-peach-50 cursor-pointer"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-brown-800 text-sm font-medium mb-2 cursor-pointer" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full p-3 border border-peach-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-all duration-300 bg-peach-50 cursor-pointer"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 mt-6 ${
                isLoading 
                  ? 'bg-coffee-400 cursor-not-allowed' 
                  : 'bg-coffee-600 hover:bg-coffee-700 transform hover:-translate-y-1 shadow-md cursor-pointer'
              } text-white flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-brown-700">
            Already have an account?{' '}
            <Link href="/login" className="text-coffee-700 font-medium hover:text-coffee-800 hover:underline transition-colors cursor-pointer">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Custom styles for animations and colors */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s;
        }
        
        .bg-peach-50 { background-color: #FFF5EB; }
        .bg-amber-100 { background-color: #FFE8D6; }
        .bg-amber-300 { background-color: #FEC89A; }
        .border-peach-300 { border-color: #FDD0B2; }
        .bg-coffee-400 { background-color: #A87D5F; }
        .bg-coffee-600 { background-color: #8B5E3C; }
        .bg-coffee-700 { background-color: #754C29; }
        .bg-coffee-800 { background-color: #603808; }
        .bg-coffee-900 { background-color: #4A2C15; }
        .text-coffee-600 { color: #8B5E3C; }
        .text-coffee-700 { color: #754C29; }
        .text-coffee-800 { color: #5C4B41; }
        .text-brown-500 { color: #9C8A7E; }
        .text-brown-600 { color: #7D6B5D; }
        .text-brown-700 { color: #5C4B41; }
        .text-brown-800 { color: #3E2E24; }
        .text-amber-100 { color: #cd956aff; }
        .text-peach-100 { color: #cd8f60ff; }
      `}</style>
    </div>
  );
}