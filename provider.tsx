"use client";
// Create a context
import { createContext, useContext, useEffect, useState } from "react";
export interface Wallet {
  privateKey: string;
  publicKey: string;
}
export interface Account {
  blockchain: {
    type: Blockchain;
    wallets: Wallet[];
  };
}

export type Blockchain = "SOLANA" | "ETHEREUM";
interface UserContextType {
  user: { accounts: Account[] } | null;
  setUser: React.Dispatch<React.SetStateAction<{ accounts: Account[] } | null>>;
}

const UserContext = createContext<UserContextType | null>(null);
export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ accounts: Account[] } | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (!currentUser) {
      const initialUser = { accounts: [] };
      localStorage.setItem("user", JSON.stringify(null));
      setUser(initialUser);
    } else {
      setUser(JSON.parse(currentUser!));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
export function useStore() {
  return useContext(UserContext);
}
