import { useEffect, useState } from "react";
import { Blockchain, Network } from "../lib/user";
import {
  HDNodeWallet,
  computeAddress,
  JsonRpcProvider,
  parseEther,
  parseUnits,
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

import axios from "axios";
import { useRecoilValue } from "recoil";
import { isDevAtom } from "../store/userAtom";
import { ETH_DEV, ETH_MAIN, SOLANA_DEV, SOLANA_MAIN } from "../lib/constants";
import { Eth_Unit } from "../lib/eth";
import { useMessage } from "./useMessage";
export const useBalance = () => {
  const [balance, setBalance] = useState(0);
  const { bark } = useMessage();
  const [loading, setLoading] = useState(false);

  const isDev = useRecoilValue(isDevAtom);
  const getBalance = async (curAddress: string, currNetwork: any) => {
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
      let tokens: any = 0;
      if (currNetwork == "ETHEREUM") {
        const ethTokensHex = response.data.result;
        tokens = Number(ethTokensHex) / Math.pow(10, 18) + " ETH";
      } else {
        tokens = response.data.result.value / Math.pow(10, 9) + " SOL";
      }
      setBalance(tokens);
      setLoading(false);
    } catch (error) {
      alert(error);
      bark({ message: "Please try again after some time", success: false });
    }
  };

  return { balance, getBalance, loading };
};

function toEthBalance() {}
