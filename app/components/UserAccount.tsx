import { useStore } from "@/provider";
import { Account } from "../lib/user";
import { useEffect, useState } from "react";

export const UserAccount = () => {
  const store = useStore();
  const [accounts, setAccounts] = useState<Account[] | undefined>([]);

  useEffect(() => {
    console.log(store?.user?.accounts);
    // setAccounts();
  }, []);
  return (
    <>
      {console.log(accounts)}
      {accounts &&
        accounts?.map((s) => {
          console.log(s);
          return <h1>"A1"</h1>;
        })}
    </>
  );
};
