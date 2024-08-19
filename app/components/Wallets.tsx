import { useRecoilState, useRecoilValue } from "recoil";
import { currentAccountAtom, userAtom } from "../store/userAtom";
import { useState, useEffect } from "react";
import { Blockchain, Network, User, Wallet as WalletType } from "./../lib/user";
import { Filter } from "./ui/Filter";
import { generateEthWallet } from "../lib/eth";
import { generateSolanaWallet } from "../lib/sol";

export const Wallets = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const currentAccount = useRecoilValue(currentAccountAtom);
  const [wallets, setWallets] = useState<WalletType[] | undefined>([]);
  const [networks, setNetworks] = useState<Network[] | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [walletsToggle, setWalletToggle] = useState<boolean>(false);

  useEffect(() => {}, [selectedWallet]);

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

  async function AddWallet() {
    if (user) {
      const newUser = new User(user.accounts); // Create a new instance
      let response;
      if (selectedNetwork?.blockchain == "ETHEREUM") {
        response = await generateEthWallet(
          selectedNetwork.wallets.length,
          newUser.accounts[currentAccount].mnemonic
        );
      } else {
        response = await generateSolanaWallet(
          selectedNetwork!.wallets.length,
          newUser.accounts[currentAccount].mnemonic
        );
      }

      if (response.err) {
        alert(response.msg);
      } else {
        const networkIndex = networks?.findIndex(
          (network) => network.blockchain === selectedNetwork?.blockchain
        );
        newUser.addWalletToNetwork(
          currentAccount - 1,
          networkIndex!,
          response.wallet!
        );
        setUser(newUser);
      }
    }
  }

  return (
    <>
      <div className=" relative flex flex-col items-center gap-5 w-full">
        {walletsToggle && (
          <svg
            onClick={() => setWalletToggle(false)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 absolute top-1  left-2 text-zinc-500"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        )}

        <div className="text-zinc-300 text-2xl">Wallets</div>
        <MenuBar
          setWalletToggle={setWalletToggle}
          networks={networks}
          currNetwork={selectedNetwork}
          setNetwork={setSelectedNetwork}
          setNetworks={setNetworks}
          setWallet={setSelectedWallet}
          currWallet={selectedWallet}
          setWallets={setWallets}
        />
        {walletsToggle ? (
          <div className="flex flex-col gap-2">
            <WalletList
              wallets={wallets}
              selectedWallet={selectedWallet}
              setSelectedWallet={setSelectedWallet}
              network={selectedNetwork}
            />
            <div
              className="text-blue-500 text-lg cursor-pointer"
              onClick={AddWallet}
            >
              + Add new {selectedNetwork?.blockchain} wallet
            </div>
          </div>
        ) : (
          <WalletDisplay
            currNetwork={selectedNetwork}
            currWallet={selectedWallet}
          />
        )}
      </div>
    </>
  );
};

export const WalletList = ({
  setSelectedWallet,
  selectedWallet,
  wallets,
  network,
}: {
  setSelectedWallet: any;
  selectedWallet: WalletType | null;
  network: Network | null;
  wallets: WalletType[] | undefined;
}) => {
  return (
    <div className="w-full ">
      {wallets?.map((w, i) => {
        return (
          <WalletDetails
            key={"wd_" + i}
            setSelectedWallet={setSelectedWallet}
            selected={selectedWallet?.publicKey == w.publicKey}
            wallet={w}
            network={network}
          />
        );
      })}
    </div>
  );
};

const WalletDetails = ({
  setSelectedWallet,
  selected,
  wallet,
  network,
}: {
  setSelectedWallet: any;
  selected: Boolean;
  network: Network | null;
  wallet: WalletType | null;
}) => {
  return (
    <div
      onClick={() => setSelectedWallet(wallet)}
      className={`${
        selected && "border-2 border-blue-500"
      } p-5 flex  justify-between items-center gap-2 bg-zinc-800 rounded-lg`}
    >
      <div className="flex gap-2 items-center">
        <img
          className="size-8 rounded-full"
          src={`/${network?.blockchain}.png`}
          alt=""
        />
        <div className="flex flex-col gap-1">
          <div className="text-zinc-300">{wallet?.title}</div>
          <div className="text-zinc-500">
            {wallet?.publicKey.substring(0, 4)}
            {"..."}
            {wallet?.publicKey.substring(
              wallet?.publicKey.length - 5,
              wallet?.publicKey.length - 1
            )}
          </div>
          <div className="text-zinc-500 ">Copy private key </div>
        </div>
      </div>

      <div className="flex gap-2 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 text-zinc-500"
        >
          <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
          <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 text-zinc-500"
        >
          <path
            fillRule="evenodd"
            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export const WalletDisplay = ({
  currWallet,
  currNetwork,
}: {
  currNetwork: Network | null;
  currWallet: WalletType | null;
}) => {
  return (
    <div className="flex flex-col gap-5 items-center w-full px-10">
      <div className="text-4xl font-bold text-white text-center ">$0.00</div>
      <div className="flex gap-5 text-zinc-500">
        <div>
          <div className="rounded-full cursor-pointer hover:bg-zinc-800 bg-zinc-700 text-blue-500 p-3 w-max">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-center">Receive</div>
        </div>
        <div>
          <div className="rounded-full cursor-pointer  hover:bg-zinc-800 bg-zinc-700 text-blue-500 p-3 w-max">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M11.47 2.47a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06l-2.47-2.47V21a.75.75 0 0 1-1.5 0V4.81L8.78 7.28a.75.75 0 0 1-1.06-1.06l3.75-3.75Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-center">Send</div>
        </div>
      </div>

      <div className="bg-zinc-700 p-3 rounded-lg mt-5 w-full flex justify-between items-center text-zinc-300">
        <div className="flex gap-5 items-center">
          <img
            className={`  size-10  rounded-full`}
            src={`/${currNetwork?.blockchain}.png`}
            alt=""
          />

          <div className="">{currNetwork?.blockchain}</div>
        </div>
        <div className="text-xl">$0.00</div>
      </div>
    </div>
  );
};
const MenuBar = ({
  setWalletToggle,
  networks,
  setNetwork,
  currNetwork,
  currWallet,
  setWallet,
  setNetworks,
  setWallets,
}: {
  setWalletToggle: any;
  setWallets: any;
  setNetworks: any;
  currWallet: WalletType | null;
  setWallet: any;
  currNetwork: Network | null;
  setNetwork: any;
  networks: Network[] | null;
}) => {
  const [user, setUser] = useRecoilState(userAtom);
  const currentAccount = useRecoilValue(currentAccountAtom);
  const [currentNetworkIndex, setCurrentNetworkIndex] = useState(0);
  async function AddNetwork(blockchain: Blockchain) {
    if (user) {
      const newUser = new User(user?.accounts);

      const networkIndex = newUser.addNetWork(currentAccount - 1, blockchain);

      let response;
      const mnemonic = user?.accounts[currentAccount - 1].mnemonic!;
      if (blockchain == "ETHEREUM") {
        response = await generateEthWallet(0, mnemonic!);
      } else {
        response = await generateSolanaWallet(0, mnemonic);
      }

      if (response.err) {
        alert(response.msg);
      } else {
        newUser.addWalletToNetwork(
          currentAccount - 1,
          networkIndex,
          response.wallet!
        );
        setWallet(() => response.wallet);

        setUser(newUser);
        setCurrentNetworkIndex(networkIndex);
      }
    }
  }
  useEffect(() => {
    const networks = user?.accounts[currentAccount - 1]?.networks;

    if (networks) {
      setNetworks(networks);
      const network = networks[currentNetworkIndex];
      setNetwork(network);
      const wallets = network.wallets;
      if (wallets) {
        setWallets(wallets);
      }
      const wallet = network.wallets[0];
      if (wallet) {
        setWallet(wallet);
      }
    }
  }, [currentNetworkIndex]);

  function modifyNetworkDropdown() {
    const arr = networks?.map((w, i) => {
      return {
        name: w.blockchain,
        action: () => setCurrentNetworkIndex(i),
        selected: currNetwork?.blockchain == w.blockchain,
      };
    });
    arr?.length == 1 &&
      arr?.push({
        name: "+ ADD NETWORK",
        action: () => {
          AddNetwork(arr[0].name == "SOLANA" ? "ETHEREUM" : "SOLANA");
        },
        selected: false,
      });
    return arr;
  }
  return (
    <div className="border-zinc-500 cursor-pointer  bg-zinc-700 text-white  border flex  items-center w-max rounded-full">
      <div className="border-r border-zinc-500">
        {" "}
        {networks && (
          <Filter
            label={currNetwork?.blockchain!}
            items={modifyNetworkDropdown()}
          />
        )}
      </div>
      <div className="" onClick={() => setWalletToggle(true)}>
        <div className="px-2 flex items-center gap-2">
          {" "}
          <div>{currWallet?.title}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-6 "
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="p-2 border-l  border-zinc-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
          <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
        </svg>
      </div>
    </div>
  );
};
