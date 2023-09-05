import { AppDataSource } from "./data-source"

import { StringSession } from "telegram/sessions"
import { EventListenerClient } from "./tgGateway/tgClient"
import { NewMessageEvent } from "telegram/events"

import { Runner } from "./ethUtils/Runner"

AppDataSource.initialize().then(async () => {




const apiId = 14526833
const apiHash = "2c6ba11e318afe05d16c96a3a86a01a7"
const stringSession = new StringSession("1AQAOMTQ5LjE1NC4xNzUuNjABu4A4hZ/Ra9rdZYAmYcQxSGu4wfKCHqGsWlIPat8kIt7wRIVSXiLuuFfhTPaMqco7ewAXQnP0TIn9HnNR6t8YfQGuG2D0gZpjlhIb1L6OTf7rz19ELuRXfyvqB1MuhLGgo2hOOggY07wGccyOsoq7jmYW+1a2jvgCPVPzb5bekT2dYOQl1PQ8c/mZd/VxLWQy+IG81iyR/HF9uFjlghB/ZhVyu/aTOtFcQT0NcYO9romUn23ZNv/tXeDugYlPcEzd6Q+P9krg2RbjvEtOGVPmGMw7GvuGCSa1uWY54qSiMymVT8ge/vujiL1dUejJW4aTw7/elgge/hLPXiVRDXAguhA=");


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

const callbackMaestro = async (event: NewMessageEvent) => {
    if (event.message.message === "❌ That doesn't look like a valid token contract address.") return
    //get the line in the message that contains 🎯 Alpha
    const line = event.message.message.split("\n").find(line => line.includes("🎯 Alpha"))
    if (!line) return
    //split |
    const hitsMaestro: number = parseInt(line.split("|")[1].trim())
    // //match the address
    const regexResult: RegExpMatchArray = event.message.message.match(/0x[a-fA-F0-9]{40}/g);
    if (!regexResult) return
    const tokenAddress: string[] = regexResult

    if (hitsMaestro < 10) return

    client.sendMessage(
        -1001848648579, 
        {
            message: `🚨 Maestro: <bold>${hitsMaestro}</bold> hits on <code>${tokenAddress[0]}</code> 🚨`,
            parseMode: "html"
        },
    )

    runner.deleteTokenFromDb(tokenAddress[0])
}

client.startClient().then(async () => {
    // client.eventNewMessage(callbackBanana, ["https://t.me/BananaGunSniper_bot"])
    client.eventNewMessage(callbackMaestro, ["https://t.me/MaestroProBot"])
}).catch(error => console.log(error))

const runner = new Runner(client);
runner.executeSearchForTokens();
}).catch(error => console.log(error))