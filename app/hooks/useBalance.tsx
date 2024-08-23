import { useEffect, useState } from "react";
import { Blockchain, Network, Wallet } from "../lib/user";
import {
  HDNodeWallet,
  computeAddress,
  JsonRpcProvider,
  parseEther,
  parseUnits,
  Wallet as ETH_WALLET,
} from "ethers";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";

import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { balanceAtom, isDevAtom } from "../store/userAtom";
import { ETH_DEV, ETH_MAIN, SOLANA_DEV, SOLANA_MAIN } from "../lib/constants";

import { useMessage } from "./useMessage";
export const useBalance = () => {
  const { bark } = useMessage();
  const [loading, setLoading] = useState(false);

  const isDev = useRecoilValue(isDevAtom);
  const setBalance = useSetRecoilState(balanceAtom);

  const getBalance = async (curAddress: string, currNetwork: string) => {
    setLoading(true);
    let host, method, params;
    if (currNetwork == "ETHEREUM") {
      host = isDev ? ETH_DEV : ETH_MAIN;
      method = "eth_getBalance";

      params = [curAddress, "latest"];
    } else {
      host = isDev ? SOLANA_DEV : SOLANA_MAIN;
      method = "getBalance";
      params = [curAddress];
    }

    try {
      const response = await axios.post(
        `https://${host}.g.alchemy.com/v2/83RfH35YJdEKRnaUSvpXCZo7sQYvf7zk`,
        {
          id: 1,
          jsonrpc: "2.0",
          method: method,
          params: params,
        }
      );
      let tokensStr: any = "";
      let tokens: any = 0;
      if (currNetwork == "ETHEREUM") {
        const ethTokensHex = response.data.result;

        tokens = Number(ethTokensHex) / Math.pow(10, 18);
        tokensStr = tokens.toFixed(2) + " ETH";
      } else {
        tokens = response.data.result.value / Math.pow(10, 9);
        tokensStr = tokens.toFixed(2) + " SOL";
      }

      setBalance((prevState) => ({
        ...prevState,
        currAmount: tokens,
        currAmountStr: tokensStr,
      }));
      setLoading(false);
    } catch (error: any) {
      bark({ message: error, success: false });
    }
  };

  return { getBalance, loading };
};

export const useTransfer = () => {
  const [transferLoading, setTransferLoading] = useState(false);
  const isDev = useRecoilValue(isDevAtom);
  const [status, setStatus] = useState<boolean>(false);
  const { bark } = useMessage();

  async function transferSol(
    wallet: Wallet,
    toAddr: string,
    amount: any,
    setRefreshBalance: any
  ) {
    try {
      setTransferLoading(true);
      const decodedPrivateKey = bs58.decode(wallet.privateKey);
      const from = Keypair.fromSecretKey(decodedPrivateKey);

      const to = new PublicKey(toAddr);
      const finalAmount = LAMPORTS_PER_SOL * amount;
      const mode = isDev ? "devnet" : "mainnet-beta";
      const connection = new Connection(clusterApiUrl(mode), "confirmed");
      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: finalAmount,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = from.publicKey;
      transaction.sign(from);

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
      );
      if (signature) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve("");
          }, 5000);
        });
        setRefreshBalance((prev: number) => prev + 1);
        bark({ message: "Transaction Successfull.", success: true });
      } else {
        bark({
          message: "Something went wrong. Please try again after sometime",
          success: false,
        });
        setTransferLoading((prev) => false);
      }
    } catch (error: any) {
      bark({ message: error, success: false });
      setTransferLoading((prev) => false);
    }
  }

  const transferETH = async (
    fromWallet: Wallet,
    toAddr: string,
    amount: any,
    setRefreshBalance: any
  ) => {
    try {
      setTransferLoading(true);
      setStatus(false);
      const host = isDev ? ETH_DEV : ETH_MAIN;
      const providerUrl = `https://${host}.g.alchemy.com/v2/${process.env.SECRET_API_KEY}`;
      const provider = new JsonRpcProvider(providerUrl);

      const privateKey = fromWallet.privateKey;
      const wallet = new ETH_WALLET(privateKey, provider);

      const transaction = {
        to: toAddr,
        value: parseEther(amount.toString()),
        gasLimit: 21000,
        gasPrice: parseUnits("10", "gwei"),
      };

      const transactionResponse = await wallet.sendTransaction(transaction);
      if (transactionResponse) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve("");
          }, 5000);
        });
        setRefreshBalance((prev: number) => prev + 1);
        bark({ message: "Transaction Successfull.", success: true });
        setTransferLoading(false);
      } else {
        bark({
          message: "Something went wrong. Please try again after sometime",
          success: false,
        });
        setTransferLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      bark({ message: error, success: false });
      setTransferLoading(false);
    }
  };

  return { transferSol, transferLoading, transferETH };
};
