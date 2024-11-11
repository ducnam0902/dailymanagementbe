import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { CreateScheduleDto } from './dto/CreateScheduleDto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async createSchedule(
    createSchedule: CreateScheduleDto,
    user: UserEntity,
  ): Promise<ScheduleEntity> {
    const newSchedule = new ScheduleEntity();
    Object.assign(newSchedule, createSchedule);
    newSchedule.user = user;
    const data = await this.scheduleRepository.insert(newSchedule);
    return data.raw[0];
  }

  async getSchedulesListByUser(user: UserEntity): Promise<ScheduleEntity[]> {
    const reponse = this.scheduleRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    return reponse;
  }

  async updateSchedule(
    updateSchedule: CreateScheduleDto,
    scheduleId: number,
  ): Promise<ScheduleEntity> {
    const currentSchedules = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
      },
    });
    if (!currentSchedules) {
      throw new UnprocessableEntityException({
        message: 'Schedule is not exists',
      });
    }

    const newSchedule: ScheduleEntity = {
      ...currentSchedules,
      ...updateSchedule,
    };

    await this.scheduleRepository.update(scheduleId, newSchedule);
    return newSchedule;
  }

  async deleteSchedule(scheduleId: number): Promise<ScheduleEntity> {
    const currentSchedules = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
      },
    });
    if (!currentSchedules) {
      throw new UnprocessableEntityException({
        message: 'Schedule is not exists',
      });
    }

    const removedItem = await this.scheduleRepository.remove(currentSchedules);
    return removedItem;
  }
}
