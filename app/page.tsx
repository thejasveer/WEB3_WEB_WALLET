"use client";

import { Welcome } from "./components/Welcome";
import { userAgentFromString } from "next/server";
import { UserAccount } from "./components/UserAccounts";
import { Create } from "./components/Create";
import { useRecoilValue } from "recoil";
import { userAtom } from "./store/userAtom";
import { Dashboard } from "./components/ui/Dashboard";
export default function Home() {
  const user = useRecoilValue(userAtom);

  if (user?.getAccounts().length == 0) {
    return <Create />;
  } else {
    return <Dashboard />;
  }
}
