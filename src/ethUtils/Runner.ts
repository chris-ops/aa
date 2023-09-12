import { ethers } from "ethers";
import { providers } from "ethers";

import minAbi from "./minAbi/minAbi";

import { Writer } from "../dbGateway/Writer";
import { BlockWithTransactions } from "./types";
import { EventListenerClient } from "../tgGateway/tgClient";
import { Api } from "telegram";
import { Token } from "../entity/Token";

require("dotenv").config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.production"
            : ".env.development",
});

const ethNode = process.env.ETH_NODE;

export class Runner {
    private provider: providers.WebSocketProvider;
    private writer: Writer;
    private client: EventListenerClient;

    constructor(client: EventListenerClient) {
        this.provider = new providers.WebSocketProvider(ethNode);
        this.writer = new Writer();
        this.client = client;
    }

    public async executeSearchForTokens() {
        this.provider.on("block", async (blockNumber: number) => {
            await this.provider.getBlockWithTransactions(blockNumber).then(async (block) => {
               await this.getCreatedTokens(block)
               await this.getAddLiquidTransactions(block)
            });
            await this.getHitsForAllTokens()
            
        })
    }

    private async checkIfLiqAddedByTransfer(transaction): Promise<false | Token> {
        const tokens = await this.writer.getAllTokens()
        return tokens.find((token) => token.tokenAddress === transaction.to)
    }

    private filterAddLiquidTransactions(block: BlockWithTransactions): providers.TransactionResponse[] {
        return block.transactions.filter(async (transaction) => {
            return transaction.data.includes("0xf305d719") || transaction.data.includes("0xe8e33700") || (
                transaction.data === '0x' && transaction.value.toString() !== '0'&& await this.checkIfLiqAddedByTransfer(transaction))
        });

    }

    private filterAddLiqThroughTransfer

    public async deleteMostRecentToken() {
        await this.writer.deleteMostRecentToken();
    }

    private async getAddLiquidTransactions(block: BlockWithTransactions) {
        const addLiquidTransactions = this.filterAddLiquidTransactions(block);
        addLiquidTransactions.forEach(async (transaction: providers.TransactionResponse) => {
            const allTokensFromDb = await this.writer.getAllTokens();
            //remove the 0x from the allTokensFromDb
            const allTokensFromDbWithout0x = allTokensFromDb.map((token) => token.tokenAddress.slice(2).toLowerCase());
            //now verify if the transaction.data contains any of them
            const tokenAddress = this.verifyIfTransactionContainsTokenAddress(transaction, allTokensFromDbWithout0x);
            if (tokenAddress) await this.writer.deleteToken(`0x${tokenAddress}`);
        });
    }

    private verifyIfTransactionContainsTokenAddress(transaction: providers.TransactionResponse, allTokensFromDbWithout0x: string[]) {
        const transactionData = transaction.data;
        return allTokensFromDbWithout0x.find((tokenAddress) => transactionData.includes(tokenAddress));
    }

    private async getCreatedTokens(block: BlockWithTransactions) {
        const contractCreationTransactions = this.filterContractCreationTransactions(block);
        contractCreationTransactions.forEach(async (transaction: TransactionResponseWithCreates) => {
            try {
                const contractAddress = transaction?.creates
                console.log(contractAddress)
                // await this.getContractFullName(contractAddress).catch(async () => {
                //     await this.deleteTokenFromDb(contractAddress);
                // });
                await this.writer.writeToken(contractAddress, 0, 0, new Date());
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
        const contract = new ethers.Contract(contractAddress, minAbi, this.provider);
        const contractName = contract.name();
        const contractSymbol = contract.symbol();

        return `${contractName} (${contractSymbol})`;
    }

    public async deleteTokenFromDb(contractAddress: string) {
        this.writer.deleteToken(contractAddress).then(() => console.log("deleted " + contractAddress + " from db"))
    }

    public async getHitsForAllTokens() {
        const tokens = await this.writer.getAllTokens();
        tokens.forEach(async (token) => {
            // const hitsBanana = await this.getHitsBanana(token.tokenAddress);
            await this.getHitsMaestro(token.tokenAddress);
        });
        this.removeOldTokens(tokens);
    }

    private removeOldTokens(tokens: Token[]) {
        tokens.forEach(async (token) => {
            //if older than 20 minutes, delete
            if (token.createdAt.getTime() < Date.now() - 20 * 60 * 1000)
                await this.writer.deleteToken(token.tokenAddress);
        });
    }
}

type TransactionResponseWithCreates = providers.TransactionResponse & { creates: string };
