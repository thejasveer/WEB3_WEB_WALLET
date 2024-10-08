import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import nacl from "tweetnacl";
import { generateNewMnemonic } from "./utils";
import { mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";
import { Wallet } from "./user";

export const SOL_UNIT = LAMPORTS_PER_SOL;
export async function generateSolanaWallet(count: number, mnemonicStr: string) {
  let mnemonic = mnemonicStr.trim();
  if (mnemonic) {
    if (!validateMnemonic(mnemonic)) {
      return {
        err: true,
        msg: "Invalid recovery phrase. Please try again.",
        wallet: null,
      };
    }
  } else {
    mnemonic = generateNewMnemonic();
  }
  try {
    const seedBuffer = mnemonicToSeedSync(mnemonic);

    const path = `m/44'/501'/${count}'/0'`;
    const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));
    const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
    const keypair = Keypair.fromSecretKey(secretKey);

    const privateKeyBase58 = bs58.encode(secretKey);
    const publicKeyBase58 = keypair.publicKey.toBase58();

    const newWallet: Wallet = {
      publicKey: publicKeyBase58,
      privateKey: privateKeyBase58,
      title: "Wallet " + (count + 1),
    };

    return {
      err: false,
      msg: "Wallet created successfully",
      wallet: newWallet,
    };
  } catch (err: any) {
    console.log(err);
    return { err: true, msg: err, wallet: null };
  }
}

// export
