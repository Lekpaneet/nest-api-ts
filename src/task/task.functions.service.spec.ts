import { Test, TestingModule } from '@nestjs/testing';
import { TaskFunctionsService } from './task.functions.service';

describe('TaskFunctionsService', () => {
  let service: TaskFunctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskFunctionsService],
    }).compile();

    service = module.get<TaskFunctionsService>(TaskFunctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
