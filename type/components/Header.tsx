'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();

    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('menu-button');

      if (
        menu &&
        menuButton &&
        !menu.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setIsMenuOpen(false);
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinkClass =
    'px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ' +
    'bg-transparent text-peach-100 hover:bg-amber-200 hover:text-coffee-700 active:bg-amber-300';

  const primaryButtonClass =
    'px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm ' +
    'bg-amber-200 text-coffee-700 hover:bg-amber-300 active:bg-amber-400';

  return (
    <>
      <header className={`${poppins.className} bg-gradient-to-r from-coffee-600 to-coffee-700 text-peach-100 p-4 shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo / Brand */}
          <Link 
            href="/" 
            className="text-2xl sm:text-3xl font-bold tracking-wide"
          >
            Typing Master
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            <Link href="/typing-test" className={navLinkClass}>
              Test
            </Link>
            <Link href="/stats" className={navLinkClass}>
              Stats
            </Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className={navLinkClass}>
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className={navLinkClass}>
                  Login
                </Link>
                <Link href="/register" className={primaryButtonClass}>
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            id="menu-button"
            className="md:hidden text-peach-100 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden mt-3 bg-coffee-600 rounded-lg shadow-lg p-4"
          >
            <nav className="flex flex-col space-y-3">
              <Link
                href="/typing-test"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Test
              </Link>
              <Link
                href="/stats"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Stats
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={navLinkClass + ' text-left'}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={primaryButtonClass + ' text-center'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Custom style for peach and coffee theme */}
      <style jsx>{`
        .bg-coffee-600 {
          background-color: #8b5e3c;
        }
        .bg-coffee-700 {
          background-color: #754c29;
        }
        .text-coffee-700 {
          color: #754c29;
        }
        .text-peach-100 {
          color: #ffe8d6;
        }
        .bg-amber-200 {
          background-color: #fedec8;
        }
        .bg-amber-300 {
          background-color: #fdd0b2;
        }
        .bg-amber-400 {
          background-color: #fcbf9f;
        }
      `}</style>
    </>
  );
}
