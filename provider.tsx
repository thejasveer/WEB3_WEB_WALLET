"use client";
// Create a context
import { useEffect, useState } from "react";
import { User } from "./app/lib/user";
import { RecoilRoot, useRecoilState } from "recoil";
import { userAtom } from "./app/store/userAtom";
import { SP } from "next/dist/shared/lib/utils";
import { Spinner } from "./app/components/ui/Spinner";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <SessionComp>{children}</SessionComp>
    </RecoilRoot>
  );
};
const SessionComp = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [ls, setLs] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && JSON.parse(storedUser).accounts.length > 0) {
      const parsedUser = JSON.parse(storedUser);
      const initialUser = new User(parsedUser.accounts);
      setUser((prev: any) => initialUser);
      localStorage.setItem("user", JSON.stringify(initialUser));
      setLs(true);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <>
      {!ls ? (
        <div className="flex justify-center items-center h-full">
          {" "}
          <Spinner />{" "}
        </div>
      ) : (
        children
      )}
    </>
  );
};
