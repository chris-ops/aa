import { TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions"
import { NewMessage, NewMessageEvent } from "telegram/events"

import input from "input"
import { EntityLike } from "telegram/define";

export class EventListenerClient extends TelegramClient {
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

    public async eventNewMessage(callbackFn: (event: NewMessageEvent) => Promise<void>, entitiesToListen: EntityLike[] ) {
        this.addEventHandler(
            callbackFn, new NewMessage({
                incoming: true,
                fromUsers: entitiesToListen
            })
        )  
    }
}
