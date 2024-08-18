"use client";
// Create a context
import { useEffect } from "react";
import { User } from "./app/lib/user";
import { RecoilRoot, useRecoilState } from "recoil";
import { userAtom } from "./app/store/userAtom";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <SessionComp>{children}</SessionComp>
    </RecoilRoot>
  );
};
const SessionComp = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && JSON.parse(storedUser).accounts.length > 0) {
      const parsedUser = JSON.parse(storedUser);
      const initialUser = new User(parsedUser.accounts);
      setUser((prev) => initialUser);
      localStorage.setItem("user", JSON.stringify(initialUser));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return <>{children}</>;
};
