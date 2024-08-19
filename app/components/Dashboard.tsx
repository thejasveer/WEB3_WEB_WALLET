import { Wallet } from "ethers";
import { UserAccounts } from "./UserAccounts";
import { Wallets } from "./Wallets";

export const Dashboard = () => {
  return (
    <div className="grid grid-cols-12 h-96 min-w-96 border-zinc-600 border rounded-md">
      <div className="border-r border-zinc-600 col-span-2   p-2  overflow-scroll">
        <UserAccounts />
      </div>

      <div className="col-span-10   p-2 ">
        <Wallets />
      </div>
    </div>
  );
};
