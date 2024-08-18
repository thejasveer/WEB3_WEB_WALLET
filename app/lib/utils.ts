 
import { generateMnemonic } from 'bip39';
 
export function generateNewMnemonic(){
    const mnemonic = generateMnemonic();
 
    return mnemonic;
}
 