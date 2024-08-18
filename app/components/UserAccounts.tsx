"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Account } from "../lib/user";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentAccountAtom, userAtom } from "../store/userAtom";
import { redirect } from "next/navigation";

export const UserAccounts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentAccountIndex = searchParams.get("account");
  const user = useRecoilValue(userAtom);
  const [accounts, setAccounts] = useState<Account[] | undefined>([]);
  const [currentAccount, setCurrentAccount] =
    useRecoilState(currentAccountAtom);

  useEffect(() => {
    console.log("ss", user);
    setCurrentAccount((prev) => Number(currentAccountIndex) ?? 0);
    // setAccounts();
  }, [currentAccountIndex]);
  function selectAccount(i: number) {
    setCurrentAccount((prev) => i);
  }
  function generateNewAccouunt() {
    console.log("uye");
    router.push("/create");
  }
  return (
    <div>
      <div className="flex flex-col gap-2   ">
        {user &&
          user.accounts?.map((s, i) => {
            return (
              <AccountD
                text={`A${i + 1}`}
                key={"account_" + i}
                selected={currentAccount == i}
                action={selectAccount}
              />
            );
          })}
      </div>

      <AccountD text="+" selected={false} action={generateNewAccouunt} />
    </div>
  );
};

const AccountD = ({
  text,
  selected,
  action,
}: {
  action: any;
  text: string;
  selected: boolean;
}) => {
  return (
    <div
      onClick={action}
      key={Math.random()}
      className={`  ${
        selected ? "  text-blue-200 bg-blue-700 " : "bg-zinc-700 "
      }mt-2 size-10 flex rounded-full  justify-center  items-center`}
    >
      {text}
    </div>
  );
};
