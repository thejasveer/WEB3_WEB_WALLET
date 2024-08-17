 
export type Blockchain = "SOLANA" | "ETHEREUM";
export interface Wallet {
    privateKey: string;
    publicKey: string;
  }
export interface Account {
    wallets: Wallet[];
    mnemonic: string;
    blockchain: Blockchain;
  }
export class User{
    accounts: Account[] = [];
  
    constructor(accounts: Account[] = []) {
        this.accounts = accounts;
      }

    createAccount(mnemonic: string, blockchain: Blockchain): number {
        const newAccount: Account = {
          wallets: [],
          mnemonic,
          blockchain,
        };
        this.accounts.push(newAccount);
        return this.accounts.length-1;
      }
    // Method to add a wallet to an account
    addWalletToAccount(accountIndex: number, wallet: Wallet): void {
        if (this.accounts[accountIndex]) {
             this.accounts[accountIndex].wallets.push(wallet);
            //  localStorage.setItem(user,{})

            } else {
            throw new Error("Account does not exist");
        }
    }
    // Method to get all accounts
    getAccounts(): Account[] {
        return this.accounts;
    }

    // Method to get a specific account by index
    getAccount(index: number): Account | null {
        return this.accounts[index] || null;
    }

    // Method to get the total number of accounts
    getAccountCount(): number {
        return this.accounts.length;
    }

}