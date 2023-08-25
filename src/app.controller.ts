import { Controller, Get, Param, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { TaskFunctionsService } from "./task/task.functions.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly taskFunctionService: TaskFunctionsService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('node-id/:propId')
  getNodeId(@Param('propId') propId: string, @Query() q: any) {
    return this.taskFunctionService.generateNoteId({
      propId: propId,
      typeId: q.type ??= 'BV',
      eventId: q.event ??= '001',
      numberId: Math.abs(q.number ??= 1),
      devMode: q.dev ??= false
    });
  }

  @Get('openssl/en/:fileText')
  getEnc(@Param('fileText') fileText: string ): string {
    return this.taskFunctionService.encryptCdc256ByFile(fileText);
  }

  @Get('openssl/de/:fileEnc')
  getDenc(@Param('fileEnc') fileEnc: string ): string {
    return this.taskFunctionService.decryptCdc256ByFile(fileEnc);
  }
}
