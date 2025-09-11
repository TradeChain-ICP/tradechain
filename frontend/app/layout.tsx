// app/layout.tsx
import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from './app-providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TradeChain - Decentralized Commodity Trading',
  description:
    'Trade commodities securely on the Internet Computer blockchain with NFID and Internet Identity',
  icons: {
    icon: '/images/tradechain-logo.png',
  },
  openGraph: {
    title: 'TradeChain - Decentralized Commodity Trading',
    description: 'Secure, fast, and transparent commodity trading powered by blockchain',
    images: ['/images/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeChain - Decentralized Commodity Trading',
    description: 'Secure, fast, and transparent commodity trading powered by blockchain',
    images: ['/images/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
