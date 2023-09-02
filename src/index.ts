import { AppDataSource } from "./data-source"
import { Token } from "./entity/Token"

import { TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions"
import { NewMessage, NewMessageEvent } from "telegram/events"
import input from "input"

AppDataSource.initialize().then(async () => {

}).catch(error => console.log(error))


const apiId = 14526833
const apiHash = "2c6ba11e318afe05d16c96a3a86a01a7"
const stringSession = new StringSession("");

(async () => {
  console.log("Loading interactive example...")
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  })
    const eventPreLiqContractAddress = (
        event: NewMessageEvent
    ) => {
        if (
            event.message.peerId.className === "PeerChannel" && 
            !event.message.peerId.channelId.compare(1592023292) 
            && event.message.message.includes("$0 / $0")
            && !event.message.message.includes('BSC')
        ) {
              const hex = event.message.message.match(/0x[a-fA-F0-9]{40}/g);
              client.sendMessage(-1001848648579, { message: `from snk lounge: ${hex[0]}` })
        }
    }
    client.addEventHandler(eventPreLiqContractAddress, new NewMessage({}))

})()
