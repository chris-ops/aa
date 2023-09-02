import { providers } from "ethers";

export interface BlockWithTransactions {
    transactions: providers.TransactionResponse[];
}