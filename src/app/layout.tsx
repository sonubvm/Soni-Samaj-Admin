import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/store/Provider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Soni Samaj Admin Panel',
  description: 'Admin dashboard for Soni Samaj family data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-gray-50 min-h-screen`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
