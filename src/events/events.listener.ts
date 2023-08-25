import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class EventsListener {

    @OnEvent('event.action')
    handleActionEvent(payload: any): void{
        setTimeout(() => {
            console.log(`On Event - `, payload);
        }, 5000);
    }
}