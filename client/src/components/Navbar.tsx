'use client';

import Link from 'next/link';
import React from 'react';
import { useWeb3 } from '../app/hooks/useAccount';

const Navbar = () => {
  const { account, connect, disconnect } = useWeb3();

  return (
    <nav className="border-b p-6">
      <h1 className="text-4xl font-bold">ConcertChain</h1>
      <div className="flex flex-row justify-between">
        <p>
          Your go-to concert ticket marketplace with the power of blockchain!
        </p>
        {account ? (
          <p>Account: {account}</p>
        ) : (
          <p>Youre not connected to a wallet!</p>
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
          {!account && (
            <button
              onClick={connect}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          )}
          {account && (
            <button
              onClick={disconnect}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Disconnect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
