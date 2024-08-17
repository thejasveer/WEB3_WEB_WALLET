"use client";

import { useStore } from "@/provider";
import { Welcome } from "./components/Welcome";
import { userAgentFromString } from "next/server";
import { UserAccount } from "./components/UserAccount";
import { Create } from "./components/Create";
export default function Home() {
  const store = useStore();

  if (store?.user?.getAccounts().length == 0) {
    return <Create />;
  } else {
    return <UserAccount />;
  }
}
