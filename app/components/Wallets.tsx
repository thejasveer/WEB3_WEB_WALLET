import { useRecoilState, useRecoilValue } from "recoil";
import { currentAccountAtom, userAtom } from "../store/userAtom";
import { useState, useEffect } from "react";
import { Network, Wallet as WalletType } from "./../lib/user";
import { Filter } from "./ui/Filter";

export const Wallets = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const currentAccount = useRecoilValue(currentAccountAtom);
  const [wallets, setWallets] = useState<WalletType[] | undefined>([]);
  const [networks, setNetworks] = useState<Network[]>();
  const [selectedNetwork, setSelectedNetwork] = useState<Network>();

  const [selectedWallet, setSelectedWallet] = useState<
    WalletType | undefined
  >();

  useEffect(() => {
    console.log(selectedWallet);
  }, [selectedWallet]);

  useEffect(() => {
    const networks = user?.accounts[currentAccount - 1]?.networks;

    if (networks) {
      setNetworks(networks);
      const network = networks[0];
      setSelectedNetwork(network);
      const wallets = network.wallets;
      if (wallets) {
        setWallets(wallets);
      }
      const wallet = network.wallets[0];
      if (wallet) {
        setSelectedWallet(wallet);
      }
    }
  }, [currentAccount]);

  function modifyNetworkDropdown() {
    const arr = networks?.map((w, i) => {
      return {
        name: w.blockchain,
        action: setSelectedNetwork(w),
      };
    });
  }

  return (
    <>
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* <Filter label={"s"} items={modifyNetworkDropdown()} action={() => {}} /> */}
    </>
  );
};
export const Wallet = () => {
  return <div></div>;
};
