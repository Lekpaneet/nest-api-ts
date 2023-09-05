import { Controller, Get, Param, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { TaskFunctionsService } from "./task/task.functions.service";
import * as moment from "moment";
import * as _ from "lodash";

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

  @Get('last-day')
  getLastDayOfMonth() {
    const _month = '02';
    const _year = '2023';
    const nowMonthOfYear = `${_year}-${_month}`;
    const countDayOfMonth = moment(nowMonthOfYear, "YYYY-MM").daysInMonth();
    const arrayDayOfMonth = [...Array(countDayOfMonth+1).keys()].slice(1);
    const dayNameIgnored = ['Saturday', 'Sunday'];
    const dateIgnored = [`${_year}-${_month}-03`, `${_year}-${_month}-30`, `${_year}-${_month}-31`];

    let dataListDate: string[] = [];

    arrayDayOfMonth.forEach(n_day => {
      let day = `${n_day}`.padStart(2, '0');
      let formatDate = `${_year}-${_month}-${day}`;
      let dayName = moment(formatDate, "YYYY-MM-DD").format('dddd');

      if(dayNameIgnored.includes(dayName) == false && dateIgnored.includes(formatDate) == false){
        dataListDate.push(`${day} : ${dayName}`);
      }
    });

    return dataListDate.at(-1);
  }

  @Get('event')
  getEvents() {
    return this.appService.getEvents();
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
