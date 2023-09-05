import { ethers } from "ethers";
import { providers } from "ethers";

import minAbi from "./minAbi/minAbi";

import { Writer } from "../dbGateway/Writer";
import { BlockWithTransactions } from "./types";
import { EventListenerClient } from "../tgGateway/tgClient";
import { Api } from "telegram";

export class Runner {
    private provider: providers.WebSocketProvider;
    private writer: Writer;
    private client: EventListenerClient;

    constructor(client: EventListenerClient) {
        this.provider = new providers.WebSocketProvider(
        "wss://greatest-smart-bush.discover.quiknode.pro/"
        );
        this.writer = new Writer();
        this.client = client;
    }

    public executeSearchForTokens() {
        this.provider.on("block", async (blockNumber: number) => {
            this.getHitsForAllTokens();
        this.provider.getBlockWithTransactions(blockNumber).then((block) => {
            this.getCreatedTokens(block);
            this.getAddLiquidTransactions(block);
        });
    })
}
    private filterAddLiquidTransactions(block: BlockWithTransactions): providers.TransactionResponse[] {
        return block.transactions.filter((transaction) => {
            return transaction.data.includes("0xf305d719");
        });
    }

    private async getAddLiquidTransactions(block: BlockWithTransactions) {
        const addLiquidTransactions = this.filterAddLiquidTransactions(block);
        addLiquidTransactions.forEach(async (transaction: providers.TransactionResponse) => {
            const allTokensFromDb = await this.writer.getAllTokens();
            //remove the 0x from the allTokensFromDb
            const allTokensFromDbWithout0x = allTokensFromDb.map((token) => token.tokenAddress.slice(2));
            //now verify if the transaction.data contains any of them
            const tokenAddress = this.verifyIfTransactionContainsTokenAddress(transaction, allTokensFromDbWithout0x);
            if (tokenAddress) this.writer.deleteToken(tokenAddress);
        });
    }

    private verifyIfTransactionContainsTokenAddress(transaction: providers.TransactionResponse, allTokensFromDbWithout0x: string[]) {
        const transactionData = transaction.data;
        const tokenAddress = allTokensFromDbWithout0x.find((tokenAddress) => transactionData.includes(tokenAddress));
        return tokenAddress;
    }

    private async getCreatedTokens(block: BlockWithTransactions) {
            const contractCreationTransactions = this.filterContractCreationTransactions(block);
            contractCreationTransactions.forEach(async (transaction: TransactionResponseWithCreates) => {
                try {
                    const contractAddress = transaction?.creates
                    console.log(contractAddress)
                    this.getContractFullName(contractAddress)
                    await this.writer.writeToken(contractAddress, 0, 0);
                    // await this.getHitsBanana(contractAddress);
                    await this.getHitsMaestro(contractAddress);
                } catch (error) {
                    
                }
            });
    }

    public async getHitsBanana(contractAddress: string): Promise<Api.Message> {
        return this.client.sendMessage(
            'https://t.me/BananaGunSniper_bot',
            {
                message: contractAddress
            }
        )
    }

    public async getHitsMaestro(contractAddress: string): Promise<Api.Message> {
        return this.client.sendMessage(
            'https://t.me/MaestroProBot',
            {
                message: contractAddress
            }
        )
    }

    public filterContractCreationTransactions(block: BlockWithTransactions): providers.TransactionResponse[] {
        return block.transactions.filter((transaction) => {
            return transaction.data.includes("0x60806040");
        });
    }

    public async getContractFullName(contractAddress: string): Promise<string> {
        try {
                const contract = new ethers.Contract(contractAddress, minAbi, this.provider);
                const contractName = contract.name();
                const contractSymbol = contract.symbol();
        
                return `${contractName} (${contractSymbol})`;
        } catch (error) {
            this.writer.deleteToken(contractAddress);
        }
    }

    public saveTokenToDb(contractAddress: string, hitsBanana: number, hitsMaestro: number) {
        this.writer.writeToken(contractAddress, hitsBanana, hitsMaestro).then(() => console.log("saved" + contractAddress + "to db"))
    }

    public deleteTokenFromDb(contractAddress: string) {
        this.writer.deleteToken(contractAddress).then(() => console.log("deleted" + contractAddress + "from db"))
    }

    public async getHitsForAllTokens() {
        const tokens = await this.writer.getAllTokens();
        tokens.forEach(async (token) => {
            // const hitsBanana = await this.getHitsBanana(token.tokenAddress);
            await this.getHitsMaestro(token.tokenAddress);
        });
    }
}

type TransactionResponseWithCreates = providers.TransactionResponse & { creates: string };
