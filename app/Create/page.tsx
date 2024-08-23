"use client";

import { useRouter } from "next/navigation";
import { Create } from "../components/Create";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/userAtom";

export default function Page() {
  const user = useRecoilValue(userAtom);
  return (
    <>
      {user?.accounts.length! > 0 && <MyWallets />}
      <Create />
    </>
  );
}

const MyWallets = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push("/?account=1");
      }}
      className="text-right cursor-pointer flex justify-end items-center text-zinc-300"
    >
      <div>My Wallets</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};
