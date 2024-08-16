import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import {  ethers } from "ethers";
import { generateMnemonic ,mnemonicToSeedSync,validateMnemonic} from 'bip39';
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";
import { Wallet } from "@/provider";
 
import { use } from "react";
// Generate a 12-word mnemonic
export function generateNewMnemonic(){
    const mnemonic = generateMnemonic();
    console.log('Generated Mnemonic:', mnemonic);
    return mnemonic;
}

export async function generateSolanaWallet(user:any,mnemonicStr:string){
    console.log("UserAccounts",user)
    const userAcc = !user?[]:user;
    const acc = userAcc.length==0 ?0:user.accounts.filter((a:any)=>a.type=="SOLANA");
    console.log(acc)
    const count = acc==0? 0 :acc.wallets.length();

    let mnemonic = mnemonicStr.trim();
    if (mnemonic) {
      if (!validateMnemonic(mnemonic)) {
        alert("Invalid recovery phrase. Please try again.");
        return;
      }
    } else {
      mnemonic = generateMnemonic();
    }

    // const words = mnemonic.split(" ");
    // setMnemonicWords(words);

    try {
      const seedBuffer = mnemonicToSeedSync(mnemonic);
     

      // Generate a single wallet
      const path = `m/44'/501'/${count}'/0'`;
      const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));
      const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
      const keypair = Keypair.fromSecretKey(secretKey);

      // Encode both private and public keys to base58
      const privateKeyBase58 = bs58.encode(secretKey);
      const publicKeyBase58 = keypair.publicKey.toBase58();

      // Create a new wallet and append it to the list
    //   Account {
    //     : {
    //       type: Blockchain;
    //       wallets: Wallet[];
    //       mnemonic: string;
    //     };
      const newWallet: Wallet = {
        publicKey: publicKeyBase58,
        privateKey: privateKeyBase58,
         
      };
    
        const account=  {
            type: "SOLANA",
            wallets:acc==0?[newWallet]:[...acc.wallets,newWallet],    
        }

       const otherAccs = userAcc.length!=0&& userAcc.filter((a:any)=>a.type!=="SOLANA"); 
        if(otherAccs)

    //   const 
    }
    catch(err:any){
        console.log(err)
    }

}

// function getCurrentWallets(){
// const 
// }