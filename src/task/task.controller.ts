import { AuthGuard } from '../user/guards/auth.guards';
import { CustomValidationResponse } from '../shared/pipes/CustomValidationResponse.pipe';
import { CreateTaskDto } from './dto/CreateTaskDto';
import { TaskService } from './task.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { TaskEntity } from './task.entity';
import { ResponseCreatedData } from '../utils';
import { CurrentWeekDto } from './dto/CurrentWeekDto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new CustomValidationResponse())
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @User() user: UserEntity,
  ): Promise<ResponseCreatedData> {
    const response = await this.taskService.createTask(user, createTaskDto);
    return {
      ok: !!response?.id,
    };
  }

  @Get(':date')
  @UseGuards(AuthGuard)
  async getAllTaskByDate(
    @User('id') userId: number,
    @Param('date') date: string,
  ): Promise<TaskEntity[]> {
    return await this.taskService.getTask(userId, date);
  }

  @Put(':taskId')
  @UseGuards(AuthGuard)
  async completedTask(
    @User('id') userId: number,
    @Param('taskId') taskId: number,
  ): Promise<TaskEntity> {
    return await this.taskService.completeTask(userId, taskId);
  }

  @Post('/getByWeek')
  @UseGuards(AuthGuard)
  @UsePipes(new CustomValidationResponse())
  async getTasksByWeek(
    @Body() currentWeek: CurrentWeekDto,
    @User('id') userId: number,
  ): Promise<TaskEntity[]> {
    return await this.taskService.getTaskByWeek(
      currentWeek.startDate,
      currentWeek.endDate,
      userId,
    );
  }

  @Post('/markCompleted')
  @UseGuards(AuthGuard)
  async markCompletedTask(
    @User('id') userId: number,
    @Body() taskIdList: string[],
  ): Promise<ResponseCreatedData> {
    const response = await this.taskService.completeTasks(userId, taskIdList);
    return {
      ok: response.length === taskIdList.length,
    };
  }
}
