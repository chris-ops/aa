import { AppDataSource } from "./data-source"

import { StringSession } from "telegram/sessions"
import { EventListenerClient } from "./tgGateway/tgClient"
import { NewMessageEvent } from "telegram/events"

import { Runner } from "./ethUtils/Runner"
import { Writer } from "./dbGateway/Writer"

AppDataSource.initialize().then(async () => {


const apiId = 20868631
const apiHash = "820e46e7f305b480a7fd0c5c6c56ab7e"
const stringSession = new StringSession("1BAAOMTQ5LjE1NC4xNjcuOTEAUBr4bAhLkv0tkBwkMDgZHNoeQpcXPDA2JHA4ZO67Kyz6kNhiDV/AZRXD/E+oMHq8sNbneELGaqQo83A/ZfTqg0YiIanpgWJuXHDr/NHPkw//iJmnx8lANxh2mF6hccfDceYxSYzg3Tbjwztidofqk5ayU893Q9W+3dCZZnzSUf6LDHIuI/hGjxyr5bHoYDb4/0AEkrXKm+guK34NCKcHRdJf8YkZvCnC9rTITh9uM98ZB0wJJ2tIWTcvTuYWX7HnnzhMudnb5ZUwDF/Xa0/EbppgHbYLxfpAdMjRGZUgH2R0mrYj6Ih6iv9fkcDxhEMKzd/6cQO5oBtSmIFgzNkFIgc=");


const client = new EventListenerClient(stringSession, apiId, apiHash);
const writer = new Writer();

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
    if (event.message.message === "❌ That doesn't look like a valid token contract address.") return runner.deleteMostRecentToken()
    //get the line in the message that contains 🎯 Alpha
    const line = event.message.message.split("\n").find(line => line.includes("🎯 Alpha"))
    if (!line) return
    //split |
    const hitsMaestro: number = parseInt(line.split("|")[1].trim())
    // //match the address
    const regexResult: RegExpMatchArray = event.message.message.match(/0x[a-fA-F0-9]{40}/g);
    if (!regexResult) return
    const tokenAddress: string[] = regexResult

    if (hitsMaestro < 20) return
    const chats = [-978286972, -1001848648579]
    for (let i = 0; i < chats.length; i++) {
        client.sendMessage(
            chats[i], 
            {
                message: `🚨 Maestro: <bold>${hitsMaestro}</bold> hits on <code>${tokenAddress[0].toLowerCase()}</code> 🚨`,
                parseMode: "html"
            },
        )
    }

    await writer.updateHitsMaestro(tokenAddress[0], hitsMaestro)
    // client.sendMessage(
    //     'https://t.me/SusScanbot',
    //     {
    //         message: tokenAddress[0]
    //     }
    // )
    await runner.deleteTokenFromDb(tokenAddress[0])

}

const callbackSusBot = async (event: NewMessageEvent) => {
    if (!event.message.message.includes("LIQ/MC: $0 / $0")) return runner.deleteMostRecentToken()

    const token = RegExp(/0x[a-fA-F0-9]{40}/g).exec(event.message.message)
    const {hitsMaestro} = writer.getToken(token[0].toLowerCase())[0]

    const chats = [-978286972, -1001848648579]
    for (let i = 0; i < chats.length; i++) {
        client.sendMessage(
            chats[i], 
            {
                message: `🚨 Maestro: <bold>${hitsMaestro}</bold> hits on <code>${token[0].toLowerCase()}</code> 🚨`,
                parseMode: "html"
            },
        )
    }
    runner.deleteTokenFromDb(token[0])
}

client.startClient().then(async () => {
    // client.eventNewMessage(callbackBanana, ["https://t.me/BananaGunSniper_bot"])
    client.eventNewMessage(callbackMaestro, ["https://t.me/MaestroProBot"])
    client.eventNewMessage(callbackSusBot, ["https://t.me/SusScanbot"])
}).catch(error => console.log(error))

const runner = new Runner(client);
runner.executeSearchForTokens();
}).catch(error => console.log(error))