import { atom } from "recoil";
import { User } from "../lib/user";

export const userAtom = atom<User | null>({
  key: "userAtom",
  default: new User(), // default value (aka initial value)
});

export const currentAccountAtom = atom({
  key: "currentAccountAtom",
  default: 0,
});

export const currentNetworkIndexAtom = atom({
  key: "currentNetworkIndexAtom",
  default: 0,
});
export const currentWalletIndexAtom = atom({
  key: "curreentNetworkIndex",
  default: 0,
});
export const isDevAtom = atom<boolean>({
  key: "isDevAtom",
  default: true,
});
export interface Balance {
  currAmount: number;
  currAmountStr: string;
}
export const balanceAtom = atom<Balance>({
  key: "balanceAtom",
  default: {
    currAmount: 0,
    currAmountStr: "0",
  },
});
