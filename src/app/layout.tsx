import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/shared/ToastProvider';
import { AuthProvider } from '@/components/auth/AuthContext';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'WeatherOps — Operational Weather Intelligence',
    template: '%s | WeatherOps',
  },
  description: 'Transform raw weather data into business decisions. Operational risk scores, alerts, and recommendations for 13 industry verticals.',
  keywords: ['weather', 'operations', 'risk management', 'business intelligence', 'saas', 'operational planning'],
  openGraph: {
    title: 'WeatherOps — Operational Weather Intelligence for Businesses',
    description: 'Operational risk scores, alerts, and recommendations for construction, logistics, agriculture, events & more.',
    type: 'website',
    siteName: 'WeatherOps',
  },
  metadataBase: new URL('https://weatherops.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
