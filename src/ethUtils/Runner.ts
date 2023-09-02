import { ethers } from "ethers";
import { providers } from "ethers";

import minAbi from "./minAbi/minAbi";

import { Writer } from "../dbGateway/Writer";
import { BlockWithTransactions } from "./types";

class Runner {
    private provider: providers.WebSocketProvider;
    private writer: Writer;

    constructor() {
        this.provider = new providers.WebSocketProvider(
        "wss://ropsten.infura.io/ws/v3/4d7e5d9a0f7e4f9a8d6f6a5b4e3e3b4c"
        );
        this.writer = new Writer();
    }

    public executeSearchForTokens() {
        this.provider.on("block", async (blockNumber: number) => {
            this.provider.getBlockWithTransactions(blockNumber).then((block) => {

            const contractCreationTransactions = this.filterContractCreationTransactions(block);
            contractCreationTransactions.forEach(async (transaction) => {

                const contractAddress = transaction?.to;
                const contractFullName = this.getContractFullName(contractAddress);
                await this.writer.writeToken(contractAddress, contractFullName, blockNumber);

            });
        });
    })
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
