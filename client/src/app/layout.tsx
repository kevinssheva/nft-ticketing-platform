'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { MetaMaskProvider } from '@metamask/sdk-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MetaMaskProvider
          debug={true}
          sdkOptions={{
            dappMetadata: {
              name: 'NFT Marketplace',
              url: window.location.href,
            },
          }}
        >
          <Navbar />
          <div className="p-0">{children}</div>
        </MetaMaskProvider>
      </body>
    </html>
  );
}
