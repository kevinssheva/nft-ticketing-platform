"use client";

import { useWallet } from "@/contexts/WalletContext";
import Link from "next/link";
import React, { useEffect } from "react";

const Navbar = () => {
  const wallet = useWallet();

  useEffect(() => {
    const connect = async () => {
      if (!wallet.provider) {
        await wallet.connectWallet();
      }
    };
    connect();
    // Run only once when the component mounts
  }, [wallet]); // Add wallet.provider as a dependency

  return (
    <nav className="border-b p-6">
      <h1 className="text-4xl font-bold">ConcertChain</h1>
      <div className="flex flex-row justify-between">
        <p>
          Your go-to concert ticket marketplace with the power of blockchain!
        </p>
        {wallet.provider ? (
          <p>Wallet: {wallet.address}</p>
        ) : (
          <p>You’re not connected to a wallet!</p>
        )}
      </div>
      <div className="flex flex-row justify-between mt-4">
        <div className="flex gap-4">
          <Link href="/" className="text-purple-500">
            Home
          </Link>
          <Link href="/event/create" className="text-purple-500">
            Create Event
          </Link>
          <Link href="/profile" className="text-purple-500">
            My Profile
          </Link>
        </div>
        <div className="flex gap-4">
          {wallet.account === null ? (
            <Link href="/register" className="text-purple-500">
              Register
            </Link>
          ) : (
            <p>Hi, {wallet.account.fullName}</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
