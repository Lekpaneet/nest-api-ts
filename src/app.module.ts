import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskFunctionsService } from './task/task.functions.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EventEmitterModule.forRoot(), EventsModule],
  controllers: [AppController],
  providers: [AppService, TaskFunctionsService],
})
export class AppModule {}
