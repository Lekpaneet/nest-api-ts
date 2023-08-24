import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskFunctionsService } from './task/task.functions.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TaskFunctionsService],
})
export class AppModule {}
