import { useEffect, useState } from "react";
import { BackButton, Button, DarkButton } from "./ui/Button";
import { Blockchain, useStore } from "@/provider";
import { generateNewMnemonic, generateSolanaWallet } from "../lib/utils";
import { time } from "console";

export const Create = () => {
  const [activeScreen, setActiveScreen] = useState<number>(2);
  const [blockchain, setBlockchain] = useState<Blockchain>();

  function handleBlockchain(chain: Blockchain) {
    console.log(chain);
    setBlockchain(chain);
    setActiveScreen(3);
  }
  switch (activeScreen) {
    case 1:
      return <Screen1 action={() => setActiveScreen(2)} />;
      break;
    case 2:
      return (
        <Screen2
          action={(chain: Blockchain) => handleBlockchain(chain)}
          back={() => setActiveScreen(1)}
        />
      );
      break;
    case 3:
      return (
        <Screen3
          back={() => setActiveScreen(2)}
          action={() => setActiveScreen(4)}
        />
      );
      break;
    case 4:
      return (
        <Screen4
          back={() => setActiveScreen(3)}
          action={() => handleBlockchain}
        />
      );
      break;
    default:
    // code block
  }
};

const Screen1 = ({ action }: { action: any }) => {
  return (
    <>
      <div className="flex flex-col h-[80vh] justify-around gap-2">
        <div className="text-center text-slate-500 text-5xl ">
          Lets get started
        </div>
        <div className="flex flex-col gap-2">
          <Button text={"Create new Wallet"} action={action} />
          <DarkButton text={"Import Wallet"} action={null} />
        </div>
      </div>
    </>
  );
};

const Screen2 = ({ action, back }: { action: any; back: any }) => {
  return (
    <>
      <BackButton action={back} />
      <div className="flex flex-col h-[80vh] justify-evenly  gap-2 ">
        <div>
          <div className="text-center text-white text-5xl ">Select Network</div>
          <div className="text-center text-slate-500 text-xl ">
            We currently support two blockchain
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <DarkButton text={"Solana"} action={() => action("SOLANA")} />
          <DarkButton text={"ETHEREUM"} action={() => action("ETHEREUM")} />
        </div>
      </div>
    </>
  );
};

const Screen3 = ({ action, back }: { action: any; back: any }) => {
  const [p, setP] = useState(false);
  return (
    <>
      <BackButton action={back} />
      <div className="flex flex-col h-[80vh] justify-evenly gap-2">
        <div className="flex flex-col gap-2">
          <div className="text-center text-white text-5xl ">
            Secret Recovery Phrase Warning
          </div>
          <div className="text-center text-slate-500 text-xl ">
            On the next page, you will receive your secret recovery phrase.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2  rounded-md bg-slate-800 text-slate-300 text-sm p-5 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {" "}
              This is the ONLY way to recover your account if you lose access to
              your device or password.
            </span>
          </div>
          <div className="flex gap-2 rounded-md bg-slate-800 text-slate-300 text-sm p-5 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {" "}
              Write it down, store it in a safe place, and NEVER share it with
              anyone.
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <input
            checked={p}
            id="checked-checkbox"
            type="checkbox"
            value=""
            onChange={() => setP(!p)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            onClick={() => setP(!p)}
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I understand that I am responsible for saving my secret recovery
            phrase, and that it is the only way to recover my wallet.
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <DarkButton text={"Next"} disabled={!p} action={action} />
        </div>
      </div>
    </>
  );
};

const Screen4 = ({ action, back }: { action: any; back: any }) => {
  const [p, setP] = useState(false);
  const [mnemonic, setmMnemonic] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [copytext, setCopyText] = useState(
    "Click anywhere to copy in the card"
  );

  useEffect(() => {
    setTimeout(() => {
      setCopyText("Click anywhere to copy in the card");
    }, 3000);
  }, [copytext]);

  useEffect(() => {
    const mn = generateNewMnemonic();
    setmMnemonic((prev) => mn);
    setWords((prev) => mn.split(" "));
  }, []);

  function copyPhrase() {
    navigator?.clipboard.writeText(mnemonic);
    setCopyText("Copied!");
  }

  const store = useStore();
  const handleWalletGenerate = async () => {
    console.log(store?.user);
    const s = await generateSolanaWallet(store?.user, mnemonic);
  };

  return (
    <>
      <BackButton action={back} />
      <div className="flex flex-col h-[80vh] justify-evenly gap-2">
        <div className="flex flex-col gap-2">
          <div className="text-center text-white text-5xl ">
            Secret Recovery Phrase
          </div>
          <div className="text-center text-slate-500 text-xl ">
            Save these words in a safe place.
          </div>
          <div className="text-center text-slate-500 text-xl ">
            <div onClick={back} className="text-center text-blue-500 text-xl ">
              Read the warning again
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            copyPhrase();
          }}
          className="flex justify-center items-center flex-col overflow-hidden"
        >
          <div className="grid grid-cols-3   gap-2 rounded-tl-xl rounded-tr-xl p-5 text-md bg-zinc-800 w-3/4">
            {words &&
              words.map((w, i) => {
                return (
                  <div className="flex gap-2" key={i}>
                    <span className="text-slate-500">{++i}</span>
                    <span className="text-white">{w}</span>
                  </div>
                );
              })}
          </div>
          <div className="border-t rounded-br-xl rounded-bl-xl p-2  text-gray-500 w-3/4 bg-zinc-800 text-center">
            {copytext}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <input
            checked={p}
            id="checked-checkbox"
            type="checkbox"
            value=""
            onChange={() => setP(!p)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            onClick={() => setP(!p)}
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I saved my secret recovery phrase.
          </label>
        </div>
        <div className="flex flex-col gap-2">
          {!p ? (
            <DarkButton text={"Next"} disabled={!p} action={null} />
          ) : (
            <Button text={"Next"} action={handleWalletGenerate} />
          )}
        </div>
      </div>
    </>
  );
};
