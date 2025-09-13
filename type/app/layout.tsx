import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Typing Master - Improve Your Typing Speed',
  description: 'Track and improve your typing speed with our beautiful, modern typing practice application.',
  keywords: 'typing, speed test, typing practice, WPM, accuracy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="gradient-peach-amber min-h-screen flex flex-col">
        <Header />
        <main>
          {children}
        </main>

        <footer className="relative">
          <div
            className="
              w-full px-6 py-10 text-center 
              bg-gradient-to-br from-peach-600 via-amber-600 to-coffee-700
              shadow-[0_10px_25px_rgba(0,0,0,0.4)]
              transform hover:scale-[1.0] transition-transform
            "
          >
            <p className="text-sm md:text-base text-white/90 font-medium tracking-wide">
              &copy; {new Date().getFullYear()} <span className="font-semibold">Typing Master</span>.  
              Built with <span className="text-white">❤️</span> for keyboard enthusiasts.
            </p>

            <div className="flex justify-center gap-8 mt-4 text-sm font-medium">
              <a href="/about" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="/privacy" className="text-white/80 hover:text-white transition-colors">Privacy</a>
              <a href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
