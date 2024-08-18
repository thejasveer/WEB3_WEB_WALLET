import { Wallet } from "ethers";
import { UserAccounts } from "./UserAccounts";
import { Wallets } from "./Wallets";

export const Dashboard = () => {
  return (
    <div className="grid grid-cols-12 h-96">
      <div className=" p-2">
        <UserAccounts />
      </div>

      <div className="col-span-10 bg-red-200 p-2 ">
        <Wallets />
      </div>
    </div>
  );
};
