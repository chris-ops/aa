import { AppDataSource } from "./data-source"

import { StringSession } from "telegram/sessions"
import { EventListenerClient } from "./tgGateway/tgClient"
import { NewMessageEvent } from "telegram/events"

import { Runner } from "./ethUtils/Runner"

AppDataSource.initialize().then(async () => {

}).catch(error => console.log(error))


const apiId = 20868631
const apiHash = "820e46e7f305b480a7fd0c5c6c56ab7e"
const stringSession = new StringSession("1BAAOMTQ5LjE1NC4xNjcuOTEAUIu9YOhNluIlVeXoGjH7dDLtEma5vNBkFMHMi7BZpBX/GQZFMpPmKqcoBnAdKHKkte4SHV+9KQuNE2AderQV6xx617QelIJQDedgvL7kmBhBpYQgZhhvAeyeFHt1PVahNGOhvqVoxczi/lxMKmp6q3qNQIjieeHZX9SZKLOSVuuCSpj6CMlLxfoQT/6Gs+RtoaaTqJv5g4eZrUt48tQl6g+uFy1uvIHZfSOhBE5b9WLINELf9DLu/jx70byEP+OqLhQStwneOdBiWdvCchCbGvwbegXvPvohCRBG/4Lt+RFYcLnC0B7OD4aUvGZlqpfndGv7fnugZWzvH2KnMava6N0=");


const client = new EventListenerClient(stringSession, apiId, apiHash);


const callbackBanana = async (event: NewMessageEvent) => {
    if (event.message.message.includes("Enter The Max")) {
        await client.sendMessage(event.message.peerId, {
            message: "0.005",
        })
    }
    if (event.message.message.includes("Select The Number")) {
        await event.message.buttons[0][0].click({})
    }
    if (event.message.message.includes("There are at least 10 wallets")) {
        const regex = /0x[a-fA-F0-9]{40}/g;
        const tokenAddress = event.message.message.match(regex);
        client.sendMessage(
            -1001848648579, 
            {
                message: `🚨 10 hits on ${tokenAddress}`
            }
        )
    }
    if (event.message.message.includes("There are at least 30 wallets")) {
        const regex = /0x[a-fA-F0-9]{40}/g;
        const tokenAddress = event.message.message.match(regex);
        client.sendMessage(
            -1001848648579, 
            {
                message: `🚨🚨🚨 30 hits on ${tokenAddress}`
            }
        )
    }
    
    else {
        for (let i = 0; i < event.message.buttons.length; i++) 
        for (let j = 0; j < event.message.buttons[i].length; j++) 
        if (event.message.buttons[i][j].text.includes("❌ MaxTx or Revert")) 
            await event.message.buttons[i][j].click({})
    }
}


client.startClient().then(async () => {
    client.eventNewMessage(callbackBanana, ["https://t.me/BananaGunSniper_bot"])
}).catch(error => console.log(error))

const runner = new Runner(client);
runner.executeSearchForTokens();