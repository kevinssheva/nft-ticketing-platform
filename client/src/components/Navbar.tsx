"use client";

import { useWallet } from "@/contexts/WalletContext";
import Link from "next/link";
import React, { useEffect } from "react";

const Navbar = () => {
  const wallet = useWallet();

  useEffect(() => {
    const connect = async () => {
      await wallet.connectWallet();
    };
    connect();
  });

  return (
    <nav className="border-b p-6">
      <h1 className="text-4xl font-bold">ConcertChain</h1>
      <div className="flex flex-row justify-between">
        <p>
          Your go to concert ticket marketplace with the power of blockhain!
        </p>
        {wallet.provider ? (
          <p>Wallet: {wallet.address}</p>
        ) : (
          <p>Youre not connected to a wallet!</p>
        )}
      </div>
      <div className="flex flex-row justify-between mt-4">
        <div className="flex gap-4">
          <Link href="/" className="text-purple-500">
            Home
          </Link>
          <Link href="/" className="text-purple-500">
            Create Ticket
          </Link>
          <Link href="/" className="text-purple-500">
            Create Event
          </Link>
          <Link href="/" className="text-purple-500">
            My Tickets
          </Link>
          <Link href="/" className="text-purple-500">
            My Listings
          </Link>
        </div>
        <div className="flex gap-4">
          <button className="text-purple-500">Register</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
