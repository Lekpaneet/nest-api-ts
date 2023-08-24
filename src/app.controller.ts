import { Controller, Get } from "@nestjs/common";
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

  @Get('openssh')
  getEnc() {
    console.log('openssh');
    return this.taskFunctionService.encryptAes256Cbc();
  }

  @Get('openssh/de')
  getDenc() {
    console.log('de openssh');
    return this.taskFunctionService.decryptAes256Cbc('1692858187668-ENCRYPTED.enc');
  }
}
