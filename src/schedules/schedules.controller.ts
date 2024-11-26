import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { AuthGuard } from '../user/guards/auth.guards';
import { CustomValidationResponse } from '../shared/pipes/CustomValidationResponse.pipe';
import { ResponseCreatedData, ResponseOKData } from '../utils';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateScheduleDto } from './dto/CreateScheduleDto';
import { ScheduleEntity } from './schedule.entity';
import { UpdateScheduleDto } from './dto/UpdateScheduleDto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new CustomValidationResponse())
  async createShedules(
    @Body() createSchedule: CreateScheduleDto,
    @User() user: UserEntity,
  ): Promise<ResponseCreatedData> {
    const response = await this.schedulesService.createSchedule(
      createSchedule,
      user,
    );
    return {
      ok: !!response?.id,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async getSchedulesListByUser(
    @User() user: UserEntity,
  ): Promise<ScheduleEntity[]> {
    const data = await this.schedulesService.getSchedulesListByUser(user);
    return data;
  }

  @Put(':scheduleId')
  @UseGuards(AuthGuard)
  @UsePipes(new CustomValidationResponse())
  async updateSchedule(
    @Body() updateSchedule: UpdateScheduleDto,
    @Param('scheduleId') scheduleId: number,
  ): Promise<ResponseCreatedData> {
    const updatedSchedule: ScheduleEntity =
      await this.schedulesService.updateSchedule(updateSchedule, scheduleId);

    return {
      ok: !!updatedSchedule.id,
    };
  }

  @Delete(':scheduleId')
  @UseGuards(AuthGuard)
  async deleteSchedule(
    @Param('scheduleId') scheduleId: number,
  ): Promise<ResponseOKData> {
    const deletedSchedule =
      await this.schedulesService.deleteSchedule(scheduleId);
    return {
      ok: deletedSchedule.id === undefined,
    };
  }
}
