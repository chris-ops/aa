import { TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions"
import { NewMessage, NewMessageEvent } from "telegram/events"

import input from "input"

class tgClient extends TelegramClient {
    constructor(
        stringSession: StringSession,
        apiId: number,
        apiHash: string,
    ) {
        super(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        });
    }

    public async startClient() {
        await this.start({
            phoneNumber: async () => await input.text("Please enter your number: "),
            password: async () => await input.text("Please enter your password: "),
            phoneCode: async () =>
                await input.text("Please enter the code you received: "),
            onError: (err) => console.log(err),
        })
    }

    public async sendMessageBanana(contractAddress) {
        await this.sendMessage(
            'https://t.me/BananaGunSniper_bot', 
            { message: contractAddress }
        )
    }

    public async eventNewMessage (event: NewMessageEvent) {
        //check if the message comes from BananaGunSniper_bot
        if (
            event.message.peerId.className === 'PeerUser' &&
            
}
