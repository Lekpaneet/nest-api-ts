import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) { }

  getHello(): string {
    return 'Hello World!';
  }

  getEvents() {
    const id = Date.now();
    this.eventEmitter.emit('event.action', {
      action: `${id} - test event action`
    });
    return `Event ID : ${id} - test event action`;
  }
}
