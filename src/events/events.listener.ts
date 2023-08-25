import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class EventsListener {
    @OnEvent('event.action')
    handleActionEvent(payload: any): void{
        const timeJob = Math.abs((Math.random()*5) *1000);
        const now = Date.now();
        setTimeout(() => {
            console.log(`On Event ${(Date.now()-now)/1000}s - `, payload);
        }, timeJob);
    }
}