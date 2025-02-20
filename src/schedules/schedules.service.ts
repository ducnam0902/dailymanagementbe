import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { CreateScheduleDto } from './dto/CreateScheduleDto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { weekdays } from 'src/utils';
import { TaskService } from 'src/task/task.service';
import { TaskEntity } from 'src/task/task.entity';
import { CronJob } from 'cron';
import * as moment from 'moment';
import { randomUUID } from 'crypto';
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
    private schedulerRegistry: SchedulerRegistry,
  ) {}

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

  checkGenerateTask(schedule: ScheduleEntity): boolean {
    const { startedAt, repeatEach, repeatType } = schedule;

    const today = moment(new Date());
    const startedAtDate = moment(new Date(startedAt));
    const isToday = today.diff(startedAtDate, 'days') === 0;

    const isRepeatDaily = repeatType === 'Daily';
    const isRepeatMonthly = repeatType === 'Monthly';
    const isRepeatWeekly = repeatType === 'Weekly';

    const weekDay = weekdays[moment(today).isoWeekday()];
    const weekDayLists = isRepeatWeekly ? repeatEach.split(', ') : [];

    //Case = today with each repeat type
    if (
      isToday &&
      (isRepeatDaily ||
        isRepeatMonthly ||
        (isRepeatWeekly && weekDayLists.includes(weekDay)))
    ) {
      return true;
    }

    const isTodayGreaterThan = today.diff(startedAtDate, 'days') > 0;
    const gapBetweenDate = today.diff(startedAtDate, 'days');

    //Case > today with repeat type weekly
    if (
      isTodayGreaterThan &&
      isRepeatWeekly &&
      weekDayLists.includes(weekDay)
    ) {
      return true;
    }

    // Case > today with repeat type daily
    if (
      isTodayGreaterThan &&
      isRepeatDaily &&
      gapBetweenDate % Number(repeatEach) === 0
    ) {
      return true;
    }

    // Case > today with repeat type monthly
    const gapBetweenYear =
      Number(today.get('year')) - Number(startedAtDate.get('year'));
    const gapBetweenMonth =
      Number(today.get('month')) - Number(startedAtDate.get('month'));

    if (
      isRepeatMonthly &&
      isTodayGreaterThan &&
      (12 * gapBetweenYear + gapBetweenMonth) % Number(repeatEach) === 0 &&
      today.get('date') === startedAtDate.get('date')
    ) {
      return true;
    }

    return false;
  }

  async addScheduleJob(schedule: ScheduleEntity): Promise<string> {
    const nameJob: string = randomUUID();
    const generatedTime = schedule.generatedAt.split(':');
    const cronTime: string = `0 ${generatedTime[1]} ${generatedTime[0]} * * *`;
    const job = new CronJob(
      cronTime,
      async () => {
        const isGeneratedTask = this.checkGenerateTask(schedule);
        if (isGeneratedTask) {
          await this.taskServices.createTask(schedule.user, {
            task: schedule.task,
            type: schedule.type,
            dateCreated: moment(new Date()).format('YYYY-MM-DD'),
          });
        }
      },
      null,
      true,
      schedule.timezone,
    );
    await this.schedulerRegistry.addCronJob(nameJob, job);
    await job.start();
    return nameJob;
  }

  async createSchedule(
    createSchedule: CreateScheduleDto,
    user: UserEntity,
  ): Promise<ScheduleEntity> {
    const newSchedule = new ScheduleEntity();
    Object.assign(newSchedule, createSchedule);
    newSchedule.user = user;
    const nameJob = await this.addScheduleJob(newSchedule);
    newSchedule.nameJob = nameJob;
    const data = await this.scheduleRepository.insert(newSchedule);
    return data.raw[0];
  }

  async updateSchedule(
    updateSchedule: CreateScheduleDto,
    scheduleId: number,
  ): Promise<ScheduleEntity> {
    const currentSchedules = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
      },
      relations: ['user'],
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

    const existsJob = this.schedulerRegistry.doesExist(
      'cron',
      currentSchedules.nameJob,
    );
    if (existsJob) {
      const job = this.schedulerRegistry.getCronJob(currentSchedules.nameJob);
      job.stop();
      await this.schedulerRegistry.deleteCronJob(currentSchedules.nameJob);
    }

    const nameJob = await this.addScheduleJob(newSchedule);
    newSchedule.nameJob = nameJob;

    await this.scheduleRepository.update(scheduleId, newSchedule);
    return newSchedule;
  }

  async deleteSchedule(scheduleId: number): Promise<ScheduleEntity> {
    const currentSchedules = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
      },
    });
    const existsJob = this.schedulerRegistry.doesExist(
      'cron',
      currentSchedules.nameJob,
    );
    if (!currentSchedules || !existsJob) {
      throw new UnprocessableEntityException({
        message: 'Schedule is not exists',
      });
    }

    if (existsJob) {
      await this.schedulerRegistry.deleteCronJob(currentSchedules.nameJob);
    }

    const removedItem = await this.scheduleRepository.remove(currentSchedules);
    return removedItem;
  }
}
