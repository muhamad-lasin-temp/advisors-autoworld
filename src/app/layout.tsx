import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Advisors Autoworld | Precision Mobility Used Car Showcase',
  description: 'Verified pre-owned luxury, sports, and executive vehicles. Explore transparent vehicle listings, technical specifications, and dealer inquiry options.',
  keywords: ['used cars', 'luxury cars', 'car showcase', 'pre-owned vehicles', 'porsche', 'bmw', 'tesla'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-on-surface antialiased overflow-x-hidden" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
