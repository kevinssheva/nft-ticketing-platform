import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConcertChain",
  description: "Concert marketplace using Blockchain!",
};

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
        <nav className="border-b p-6">
          <h1 className="text-4xl font-bold">ConcertChain</h1>
          <p>
            Your go to concert ticket marketplace with the power of blockhain!
          </p>
          <div className="flex mt-4">
            <Link href="/" className="mr-4 text-purple-500">
              Home
            </Link>
            <Link href="/" className="mr-4 text-purple-500">
              Create Ticket
            </Link>
            <Link href="/" className="mr-4 text-purple-500">
              Create Event
            </Link>
            <Link href="/" className="mr-4 text-purple-500">
              My Tickets
            </Link>
            <Link href="/" className="mr-4 text-purple-500">
              My Listings
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
