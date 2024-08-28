import { Wallet } from "ethers";
import { UserAccounts } from "./UserAccounts";
import { Wallets } from "./Wallets";
import { useRecoilState } from "recoil";
import { isDevAtom } from "../store/userAtom";

export const Dashboard = () => {
  const [isDev, setDev] = useRecoilState(isDevAtom);
  return (
    <div className="grid grid-cols-12 h-[30rem] max-w-96  min-w-96  border-zinc-600 border rounded-md">
      <div className="border-r border-zinc-600 col-span-2   p-2  overflow-auto no-scrollbar">
        <UserAccounts />
      </div>

      <div className="relative col-span-10 overflow-auto no-scrollbar  p-1 w-full ">
        <Wallets />
        <div className="absolute top-2 right-2">
          <label className=" flex flex-col sm:flex-row items-center mb-5 cursor-pointer">
            <input
              type="checkbox"
              onChange={() => setDev(!isDev)}
              value=""
              className="sr-only peer"
              checked={isDev}
            />
            <div className="relative w-9 h-5    peer-focus:ring-blue-800 rounded-full peer  bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all  border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-blue-500  ">
              {isDev ? "TEST" : "MAINNET"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
