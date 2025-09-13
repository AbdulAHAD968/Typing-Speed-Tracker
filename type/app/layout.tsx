import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import ClientLayout from '../components/ClientLayout';

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
  icons: {
    icon: '/my-app-icon.png',
    shortcut: '/my-app-icon.png',
    apple: '/my-app-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="gradient-peach-amber min-h-screen flex flex-col">
        <ClientLayout>
          <Header />
          <main>{children}</main>
          <footer className="relative">
            <div
              className="
                w-full px-6 py-10 text-center 
                bg-gradient-to-br from-peach-600 via-amber-200 to-coffee-700
                shadow-[0_10px_25px_rgba(0,0,0,0.4)]
                transform hover:scale-[1.0] transition-transform
              "
            >
              <p className="text-sm md:text-base text-grey/90 font-medium tracking-wide">
                &copy; {new Date().getFullYear()} <span className="font-semibold">Typing Master</span>.  
                Built for keyboard enthusiasts.
              </p>
              <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                <a 
                  href="/about" 
                  className="px-3 py-1 rounded-lg text-coffee-900 bg-amber-200/80 hover:bg-amber-400 hover:text-coffee-900 transition-colors"
                >
                  About
                </a>
                <a 
                  href="/privacy" 
                  className="px-3 py-1 rounded-lg text-coffee-900 bg-amber-200/80 hover:bg-amber-400 hover:text-coffee-900 transition-colors"
                >
                  Privacy
                </a>
                <a 
                  href="/contact" 
                  className="px-3 py-1 rounded-lg text-coffee-900 bg-amber-200/80 hover:bg-amber-400 hover:text-coffee-900 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </ClientLayout>
      </body>
    </html>
  );
}