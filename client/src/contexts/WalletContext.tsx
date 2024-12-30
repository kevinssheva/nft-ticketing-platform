"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Account } from "@/db/schema";
interface WalletContextProps {
  provider: Web3Provider | null;
  address: string | null;
  account: Account | null;
  connectWallet: () => Promise<void>;
  fetchAccount: (walletAddress: string) => Promise<Account | null>;
  registerAccount: (
    username: string,
    fullName: string,
    idCard: string
  ) => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];
        setAddress(walletAddress);

        const provider = new Web3Provider(window.ethereum);
        setProvider(provider);

        const accountData = await fetchAccount(walletAddress);
        setAccount(accountData);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed. Please install MetaMask.");
    }
  };

  const fetchAccount = async (
    walletAddress: string
  ): Promise<Account | null> => {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Account not found in the database.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      return null;
    }
  };

  const registerAccount = async (
    username: string,
    fullName: string,
    idCard: string
  ) => {
    if (!address) {
      throw Error("Wallet address is required to register.");
    }

    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, username, fullName, idCard }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccount(data);
        console.log("Account registered successfully.");
      } else {
        console.error("Error registering account.");
      }
    } catch (error) {
      console.error("Error registering account:", error);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          connectWallet();
        } else {
          setAddress(null);
          setAccount(null);
          console.error("No accounts found.");
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  });

  return (
    <WalletContext.Provider
      value={{
        provider,
        address,
        account,
        connectWallet,
        fetchAccount,
        registerAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
