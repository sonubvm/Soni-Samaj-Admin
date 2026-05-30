import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/store/Provider';

export const metadata: Metadata = {
  title: 'Soni Samaj Uttarbhartiya Trust Surat Admin Panel',
  description: 'Admin dashboard for Soni Samaj Uttarbhartiya Trust Surat family data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 min-h-screen">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
