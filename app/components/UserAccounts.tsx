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
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    ); // Get current search params
    currentParams.set("account", (i + 1).toString());

    router.replace(`?${currentParams.toString()}`, { scroll: false });
    const path = "/?account=" + (i + 1);
    router.push(path);
  }
  function generateNewAccouunt() {
    router.push("/create");
  }
  return (
    <div className="flex flex-col gap-2 items-center ">
      <div className="flex flex-col gap-2 items-center  ">
        {user &&
          user.accounts?.map((s, i) => {
            return (
              <AccountD
                text={`A${i + 1}`}
                key={"account_" + i}
                selected={currentAccount - 1 == i}
                action={() => selectAccount(i)}
              />
            );
          })}
      </div>

      <AccountD text="+" selected={false} action={generateNewAccouunt} />
    </div>
  );
};

export const AccountD = ({
  text,
  selected,
  action,
}: {
  action: any;
  text: string;
  selected?: boolean;
}) => {
  return (
    <div
      onClick={action}
      key={Math.random()}
      className={`  ${
        selected ? "  text-blue-200 bg-blue-700 " : "bg-zinc-700 text-zinc-300 "
      } mt-2 size-10 flex rounded-full cursor-pointer justify-center  items-center`}
    >
      {text}
    </div>
  );
};
