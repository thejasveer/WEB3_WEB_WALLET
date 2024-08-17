"use client";
// Create a context
import { createContext, useContext, useEffect, useState } from "react";
import { User, Account, Blockchain, Wallet } from "./app/lib/user";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
const UserContext = createContext<UserContextType | null>(null);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && JSON.parse(storedUser).accounts.length > 0) {
      const parsedUser = JSON.parse(storedUser);
      console.log(parsedUser);
      setUser((prev) => new User(parsedUser.accounts));
      //working on rendering accounts
    } else {
      const initialUser = new User();

      setUser(initialUser);
      localStorage.setItem("user", JSON.stringify(initialUser));
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
