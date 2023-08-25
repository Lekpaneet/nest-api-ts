import { Module } from '@nestjs/common';
import { EventsListener } from './events.listener';

@Module({
  controllers: [],
  providers: [EventsListener],
})
export class EventsModule {}
