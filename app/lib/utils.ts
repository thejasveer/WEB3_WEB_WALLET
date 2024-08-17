import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import {  ethers } from "ethers";
import { generateMnemonic ,mnemonicToSeedSync,validateMnemonic} from 'bip39';
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";
import { Wallet } from "./user";
 
import { use } from "react";
// Generate a 12-word mnemonic
export function generateNewMnemonic(){
    const mnemonic = generateMnemonic();
 
    return mnemonic;
}
//test
export async function generateSolanaWallet(count:number,mnemonicStr:string){
 
 

    let mnemonic = mnemonicStr.trim();
    if (mnemonic) {
      if (!validateMnemonic(mnemonic)) {
 
        return {err:true,msg:"Invalid recovery phrase. Please try again.",wallet:null};
      }
    } else {
      mnemonic = generateMnemonic();
    }
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
 
      const newWallet: Wallet = {
        publicKey: publicKeyBase58,
        privateKey: privateKeyBase58,
         
      };
      
      return {err:false,msg:"Wallet created successfully",wallet:newWallet};
 
    }
    catch(err:any){
        console.log(err)
        return {err:true,msg:err,wallet:null};
    }

}

// function getCurrentWallets(){
// const 
// }