import { Wallet as ETH_WALLET, HDNodeWallet, WeiPerEther } from "ethers";
import { mnemonicToSeedSync, validateMnemonic } from "bip39";
import { Wallet } from "./user";
import { generateNewMnemonic } from "./utils";

export const Eth_Unit = WeiPerEther;
export async function generateEthWallet(count: number, mnemonicStr: string) {
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

    const derivationPath = `m/44'/60'/${count}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seedBuffer);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    const wallet = new ETH_WALLET(privateKey);

    const newWallet: Wallet = {
      publicKey: wallet.address,
      privateKey: privateKey,
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
