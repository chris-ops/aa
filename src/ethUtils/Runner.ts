import { ethers } from "ethers";
import { providers } from "ethers";

import minAbi from "./minAbi/minAbi";

import { Writer } from "../dbGateway/Writer";
import { BlockWithTransactions } from "./types";
import { EventListenerClient } from "../tgGateway/tgClient";

export class Runner {
    private provider: providers.WebSocketProvider;
    // private writer: Writer;
    private client: EventListenerClient;

    constructor(client: EventListenerClient) {
        this.provider = new providers.WebSocketProvider(
        "wss://greatest-smart-bush.discover.quiknode.pro/"
        );
        // this.writer = new Writer();
        this.client = client;
    }

    public executeSearchForTokens() {
        this.provider.on("block", async (blockNumber: number) => {
            this.provider.getBlockWithTransactions(blockNumber).then((block) => {
            console.log(blockNumber)
            const contractCreationTransactions = this.filterContractCreationTransactions(block);
            contractCreationTransactions.forEach(async (transaction: TransactionResponseWithCreates) => {
                try {
                    console.log(transaction)
                    const contractAddress = transaction?.creates
                    console.log(contractAddress)
                    // const contractFullName = this.getContractFullName(contractAddress);
                    // await this.writer.writeToken(contractAddress, contractFullName, blockNumber);
                    this.client.sendMessage(
                        'https://t.me/BananaGunSniper_bot',
                        {
                            message: contractAddress
                        }
                    )
                } catch (error) {
                    
                }
            });
            });
        });
    }

    public filterContractCreationTransactions(block: BlockWithTransactions): providers.TransactionResponse[] {
        return block.transactions.filter((transaction) => {
            return transaction.data.includes("0x60806040");
        });
    }

    public getContractFullName(contractAddress: string): string {
        const contract = new ethers.Contract(contractAddress, minAbi, this.provider);
        const contractName = contract.name();
        const contractSymbol = contract.symbol();

        return `${contractName} (${contractSymbol})`;
    }
}

type TransactionResponseWithCreates = providers.TransactionResponse & { creates: string };
