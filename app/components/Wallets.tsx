import { useRecoilState, useRecoilValue } from "recoil";
import { currentAccountAtom, isDevAtom, userAtom } from "../store/userAtom";
import { useState, useEffect, useRef } from "react";
import { Blockchain, Network, User, Wallet as WalletType } from "./../lib/user";
import { Filter } from "./ui/Filter";
import { generateEthWallet } from "../lib/eth";
import { generateSolanaWallet } from "../lib/sol";
import QRCode from "react-qr-code";
import { useBalance } from "../hooks/useBalance";
import { get } from "http";
import { Spinner } from "./ui/Spinner";
import { useMessage } from "../hooks/useMessage";

type actionTabs = "RECEIVE" | "SEND" | "WALLETS" | "HOME";

export const Wallets = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const currentAccount = useRecoilValue(currentAccountAtom);
  const [wallets, setWallets] = useState<WalletType[] | undefined>([]);
  const [networks, setNetworks] = useState<Network[] | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  const [activeTab, setActiveTab] = useState<actionTabs>("HOME");
  const { bark } = useMessage();
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
          wallets?.length || 0,
          newUser.accounts[currentAccount - 1].mnemonic
        );
      } else {
        response = await generateSolanaWallet(
          wallets?.length || 0,
          newUser.accounts[currentAccount - 1].mnemonic
        );
      }

      if (response.err) {
        alert(response.msg);
      } else {
        const networkIndex = networks?.findIndex(
          (network) => network.blockchain === selectedNetwork?.blockchain
        );
        const upadteduser = newUser.addWalletToNetwork(
          currentAccount - 1,
          networkIndex!,
          response.wallet!
        );
        setUser((prev) => newUser);
        setSelectedWallet((prev) => response.wallet);
        wallets && setWallets([...wallets, response.wallet!]);
        setActiveTab("HOME");
        bark({ message: "Wallet created successfully.", success: true });
        //update state
      }
    }
  }

  return (
    <>
      <div className=" w-96 relative flex flex-col items-center gap-5 ">
        {activeTab != "HOME" && (
          <svg
            onClick={() => setActiveTab("HOME")}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 absolute top-1 cursor-pointer  left-2 text-zinc-500"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        )}

        {activeTab != "RECEIVE" && (
          <div>
            {" "}
            <div className="text-zinc-300 text-2xl text-center mb-2">
              Wallets
            </div>
            <MenuBar
              setActiveTab={setActiveTab}
              networks={networks}
              currNetwork={selectedNetwork}
              setNetwork={setSelectedNetwork}
              setNetworks={setNetworks}
              setWallet={setSelectedWallet}
              currWallet={selectedWallet}
              setWallets={setWallets}
            />
          </div>
        )}
        {activeTab == "WALLETS" && (
          <div className="flex flex-col gap-2 w-full p-3">
            <WalletList
              setActiveTab={setActiveTab}
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
        )}
        {activeTab == "HOME" && selectedNetwork && selectedWallet && (
          <WalletDisplay
            setActiveTab={setActiveTab}
            currNetwork={selectedNetwork}
            currWallet={selectedWallet}
          />
        )}
        {activeTab == "RECEIVE" && (
          <Receive
            address={selectedWallet?.publicKey!}
            network={selectedNetwork?.blockchain!}
          />
        )}
      </div>
    </>
  );
};

export const Receive = ({
  address,
  network,
}: {
  network: string;
  address: string;
}) => {
  return (
    <div className="flex w-full gap-5 flex-col items-center p-5 ">
      <div className="text-2xl ">Deposit</div>
      <div className="size-1/2  border rounded-md p-1">
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={address}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div className="flex gap-1  text-blue-600 ">
        <div>
          {" "}
          {address.substring(0, 4)}
          {"........"}
          {address.substring(address.length - 5, address.length)}
        </div>
        <button className="flex">
          <CopyAddress address={address} />
        </button>
      </div>

      <div className="text-center text-zinc-400">
        This address can only recive assets on {network}
      </div>
    </div>
  );
};

export const WalletList = ({
  setSelectedWallet,
  selectedWallet,
  wallets,
  network,
  setActiveTab,
}: {
  setActiveTab: any;
  setSelectedWallet: any;
  selectedWallet: WalletType | null;
  network: Network | null;
  wallets: WalletType[] | undefined;
}) => {
  return (
    <div className="w-full  flex flex-col gap-2 ">
      {wallets?.map((w, i) => {
        return (
          <WalletDetails
            setActiveTab={setActiveTab}
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
  setActiveTab,
}: {
  setActiveTab: any;
  setSelectedWallet: any;
  selected: Boolean;
  network: Network | null;
  wallet: WalletType | null;
}) => {
  //TODO remove Wallet

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        setActiveTab("HOME");
        setSelectedWallet(wallet);
      }}
      className={`${
        selected && "border-2 border-blue-500"
      } p-5 flex  justify-between items-center gap-2 bg-zinc-800 rounded-lg`}
    >
      <div className="flex w-full gap-2 items-center">
        <img
          className="size-8 rounded-full"
          src={`/${network?.blockchain}.png`}
          alt=""
        />
        <div className="flex flex-col gap-1 w-full">
          <div className="text-zinc-300">{wallet?.title}</div>
          <div className="  text-zinc-500 flex justify-between gap-2 ">
            <div> Public</div>
            <CopyAddress address={wallet?.publicKey} />
            <div>
              {" "}
              {wallet?.publicKey.substring(0, 4)}
              {"........"}
              {wallet?.publicKey.substring(
                wallet?.publicKey.length - 5,
                wallet?.publicKey.length
              )}
            </div>
          </div>
          <div className="text-zinc-500 flex justify-between gap-2 ">
            <div> Private</div>
            <CopyAddress address={wallet?.privateKey} />
            <div>
              {" "}
              {wallet?.privateKey.substring(0, 4)}
              {"........"}
              {wallet?.privateKey.substring(
                wallet?.privateKey.length - 5,
                wallet?.privateKey.length
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CopyAddress = ({ address }: { address?: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(address || "");
    setCopied(true);
  };
  useEffect(() => {
    setTimeout(() => setCopied(false), 2 * 1000);
  }, [copied]);
  return copied ? (
    <div>Copied</div>
  ) : (
    <svg
      onClick={(e) => {
        e.stopPropagation();
        copy();
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
      <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
    </svg>
  );
};

export const WalletDisplay = ({
  setActiveTab,
  currWallet,
  currNetwork,
}: {
  setActiveTab: any;
  currNetwork: Network | null;
  currWallet: WalletType | null;
}) => {
  const isDev = useState(isDevAtom);
  const { balance, getBalance, loading } = useBalance();
  const prevWallet = useRef<WalletType | null>(null);

  const prevNetwork = useRef<Network | null>(null);

  useEffect(() => {
    if (
      currWallet?.publicKey &&
      currNetwork?.blockchain &&
      (currWallet?.publicKey !== prevWallet.current ||
        currNetwork?.blockchain !== prevNetwork.current)
    ) {
      getBalance(currWallet.publicKey, currNetwork.blockchain);
      prevWallet.current = currWallet.publicKey;
      prevNetwork.current = currNetwork.blockchain;
    }
  }, [currWallet?.publicKey!, currNetwork?.blockchain, isDev]);
  useEffect(() => {
    getBalance(currWallet.publicKey, currNetwork.blockchain);
  }, [isDev]);
  return (
    <div className="flex flex-col gap-5 items-center w-full px-3">
      <div className="text-4xl font-bold text-white text-center ">
        {loading ? <Spinner /> : balance} {}{" "}
      </div>
      <div className="flex gap-5 text-zinc-500">
        <div>
          <div
            className="rounded-full cursor-pointer hover:bg-zinc-800 bg-zinc-700 text-blue-500 p-3 w-max"
            onClick={() => setActiveTab("RECEIVE")}
          >
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

      <div className=" rounded-lg mt-5 w-full flex justify-between items-center text-zinc-300">
        <div className="flex gap-5 items-center">
          <img
            className={`  size-10  rounded-full`}
            src={`/${currNetwork?.blockchain}.png`}
            alt=""
          />

          <div className="">{currNetwork?.blockchain}</div>
        </div>
        <div className="text-lg">
          {" "}
          {loading ? <Spinner /> : balance} {}{" "}
        </div>
      </div>
    </div>
  );
};
const MenuBar = ({
  setActiveTab,
  networks,
  setNetwork,
  currNetwork,
  currWallet,
  setWallet,
  setNetworks,
  setWallets,
}: {
  setActiveTab: any;
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
      <div className="" onClick={() => setActiveTab("WALLETS")}>
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
        <CopyAddress address={currWallet?.publicKey} />
      </div>
    </div>
  );
};
