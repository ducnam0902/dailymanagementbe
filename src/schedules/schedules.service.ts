import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Not, Raw, Repository } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { CreateScheduleDto } from './dto/CreateScheduleDto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { weekdays } from 'src/utils';
import { TaskService } from 'src/task/task.service';
import { TaskEntity } from 'src/task/task.entity';
@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly taskServices: TaskService,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
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

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCreateTasksFollowSchedule() {
    const today = moment().format('YYYY-MM-DD');
    const response = await this.scheduleRepository.find({
      where: {
        repeatType: Not('Off'),
        startedAt: Raw((alias) => `${alias} <= :today`, { today }),
      },
      relations: ['user'],
    });
    response.forEach(async (item: ScheduleEntity) => {
      if (item.repeatType === 'Weekly') {
        const weekDay = weekdays[moment(today).isoWeekday()];
        const repeatEachDayInWeek = item.repeatEach.split(', ');
        if (repeatEachDayInWeek.includes(weekDay)) {
          await this.taskServices.createTask(item.user, {
            task: item.task,
            type: item.type,
            dateCreated: today,
          });
        }
      }

      if (item.repeatType === 'Daily') {
        if (
          item.repeatEach === '1' ||
          moment(item.startedAt).diff(moment(today)) === 0
        ) {
          await this.taskServices.createTask(item.user, {
            task: item.task,
            type: item.type,
            dateCreated: today,
          });
        } else {
          const dateGeneratedBefore = moment(today).subtract(
            item.repeatEach,
            'days',
          );

          const dateSearch =
            dateGeneratedBefore.diff(moment(item.startedAt)) < 0
              ? item.startedAt
              : dateGeneratedBefore;

          const taskGeneratedBefore = await this.taskRepository.find({
            where: {
              task: item.task,
              type: item.type,
              dateCreated: Raw((alias) => `${alias} >= :startedDate`, {
                startedDate: dateSearch,
              }),
            },
          });

          const expectedDateGenerated = moment(
            taskGeneratedBefore.length === 0
              ? item.startedAt
              : dateGeneratedBefore,
          ).add(2, 'days');

          if (expectedDateGenerated.diff(moment(today)) === 0) {
            await this.taskServices.createTask(item.user, {
              task: item.task,
              type: item.type,
              dateCreated: today,
            });
          }
        }
      }

      if ((item.repeatType = 'Monthly')) {
        // if (moment(item.startedAt).diff(moment(today)) === 0) {
        //   await this.taskServices.createTask(item.user, {
        //     task: item.task,
        //     type: item.type,
        //     dateCreated: today,
        //   });
        // }
        // const todayMoment = moment();
        // const startOfMonth = todayMoment.startOf('months');
        // const endOfMonth = todayMoment.endOf('months');
        // console.log('todayMoment', todayMoment);
        // console.log('startOfMonth', startOfMonth);
        // console.log('endOfMonth', endOfMonth);
      }
    });
  }
}
