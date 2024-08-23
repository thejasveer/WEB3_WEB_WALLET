"use client";

import { Create } from "./components/CreateN";
import { useRecoilValue } from "recoil";
import { userAtom } from "./store/userAtom";
import { Dashboard } from "./components/Dashboard";
import { Spinner } from "./components/ui/Spinner";
export default function Home() {
  const user = useRecoilValue(userAtom);
  if (user) {
    if (user?.accounts.length == 0) {
      return <Create />;
    } else {
      return <Dashboard />;
    }
  } else {
    <>
      <Spinner />
    </>;
  }
}
