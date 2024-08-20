"use client";

import { Welcome } from "./components/Welcome";
import { userAgentFromString } from "next/server";
import { UserAccounts } from "./components/UserAccounts";
import { Create } from "./components/Create";
import { useRecoilValue } from "recoil";
import { userAtom } from "./store/userAtom";
import { Dashboard } from "./components/Dashboard";
export default function Home() {
  const user = useRecoilValue(userAtom);
  console.log(user);

  if (user?.getAccounts().length == 0) {
    return <Create />;
  } else {
    return <Dashboard />;
  }
}
