export type Blockchain = "SOLANA" | "ETHEREUM" | "+ ADD NETWORK";
export interface Wallet {
  privateKey: string;
  publicKey: string;
  title: string;
}

export interface Network {
  wallets: Wallet[];
  blockchain: Blockchain;
}
export interface Account {
  mnemonic: string;
  networks: Network[];
}
export class User {
  accounts: Account[] = [];

  constructor(accounts?: Account[]) {
    this.accounts = accounts ? [...accounts] : [];
  }

  createAccount(mnemonic: string, blockchain: Blockchain): any {
    if (this.accounts) {
      const newAccount: Account = {
        networks: [
          {
            wallets: [],
            blockchain: blockchain,
          },
        ],
        mnemonic,
      };

      this.accounts.push(newAccount);
      return this.accounts?.length - 1;
    }
  }

  addNetWork(accountIndex: number, blockchain: Blockchain) {
    const network = {
      wallets: [],
      blockchain: blockchain,
    };
    // Clone the account
    const updatedAccount = {
      ...this.accounts[accountIndex],
      networks: [...this.accounts[accountIndex].networks, network], // Ensure networks array is new
    };

    // Replace the old account with the updated one
    this.accounts[accountIndex] = updatedAccount;

    return this.accounts[accountIndex].networks.length - 1;
  }
  // Method to add a wallet to an account
  addWalletToNetwork(
    accountIndex: number,
    networkIndex: number,
    wallet: Wallet
  ): void {
    if (this.accounts)
      if (this.accounts[accountIndex]) {
        const account = this.accounts[accountIndex];
        const updatedNetworks = account.networks.map((network, index) => {
          if (index === networkIndex) {
            return {
              ...network,
              wallets: [...network.wallets, wallet],
            };
          }
          return network;
        });

        const updatedAccount = {
          ...account,
          networks: updatedNetworks,
        };

        this.accounts = this.accounts.map((acc, i) =>
          i === accountIndex ? updatedAccount : acc
        );
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
