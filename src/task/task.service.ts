import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/CreateTaskDto';
import { UserEntity } from 'src/user/user.entity';
import { Raw } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';
import * as moment from 'moment';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9PM, {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleSendTaskUncompleted() {
    const today = moment().format('YYYY-MM-DD');
    const response = await this.taskRepository.find({
      where: {
        dateCreated: today,
      },
      loadRelationIds: true,
      relations: ['user'],
      order: {
        user: {
          id: 'DESC',
        },
        isCompleted: 'ASC',
      },
    });
    const taskByUserList = response.reduce((prevTask, currTask) => {
      const id = currTask.user.toString();
      if (Object.keys(prevTask).includes(id)) {
        return {
          ...prevTask,
          [id]: [...prevTask[id], currTask],
        };
      }
      return {
        ...prevTask,
        [id]: [currTask],
      };
    }, {});

    Object.keys(taskByUserList).forEach(async (item) => {
      const user = await this.userRepository.findOne({
        where: {
          id: Number(item),
        },
      });
      await this.mailService.sendEmailTaskIsNotCompleted(
        taskByUserList[item],
        user,
      );
    });
  }

  async createTask(
    user: UserEntity,
    CreateTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const newTask = new TaskEntity();
    Object.assign(newTask, CreateTaskDto);
    newTask.user = user;
    const data = await this.taskRepository.insert(newTask);
    return data.raw[0];
  }

  async getTask(userId: number, date: string): Promise<TaskEntity[]> {
    const response = await this.taskRepository.find({
      where: {
        dateCreated: Raw((alias) => `${alias} = :date`, { date }),
        user: {
          id: userId,
        },
      },
      relations: {
        user: false,
      },
      order: {
        isCompleted: 'ASC',
      },
    });
    return response;
  }

  async completeTask(userId: number, taskId: number): Promise<TaskEntity> {
    const existedTask: TaskEntity = await this.taskRepository.findOne({
      where: {
        id: taskId,
        user: {
          id: userId,
        },
      },
    });
    if (!existedTask) {
      throw new UnprocessableEntityException({
        message: 'Task is exists',
      });
    }
    const completedTask: TaskEntity = {
      ...existedTask,
      isCompleted: true,
    };
    await this.taskRepository.update(existedTask.id, { isCompleted: true });
    return completedTask;
  }

  async getTaskByWeek(
    startDate: string,
    endDate: string,
    userId: number,
  ): Promise<TaskEntity[]> {
    const response = await this.taskRepository.find({
      where: {
        dateCreated: Raw(
          (alias) => `${alias} >= :startDate AND ${alias} <= :endDate`,
          { startDate, endDate },
        ),
        user: {
          id: userId,
        },
      },
      relations: {
        user: false,
      },
      order: {
        dateCreated: 'ASC',
        isCompleted: 'ASC',
      },
    });

    return response;
  }

  async completeTasks(
    userId: number,
    taskIdList: string[],
  ): Promise<TaskEntity[]> {
    const updatedTasks = Promise.all(
      taskIdList.map(async (item) => {
        return await this.completeTask(userId, Number(item));
      }),
    );
    return updatedTasks;
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM, {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleSendTaskToday() {
    const today = moment().format('YYYY-MM-DD');
    const response = await this.taskRepository.find({
      where: {
        dateCreated: today,
      },
      loadRelationIds: true,
      relations: ['user'],
      order: {
        user: {
          id: 'DESC',
        },
      },
    });

    const taskByUserList = response.reduce((prevTask, currTask) => {
      const id = currTask.user.toString();
      if (Object.keys(prevTask).includes(id)) {
        return {
          ...prevTask,
          [id]: [...prevTask[id], currTask],
        };
      }
      return {
        ...prevTask,
        [id]: [currTask],
      };
    }, {});

    Object.keys(taskByUserList).forEach(async (item) => {
      const user = await this.userRepository.findOne({
        where: {
          id: Number(item),
        },
      });
      await this.mailService.sendEmailTaskToday(taskByUserList[item], user);
    });
  }
}
