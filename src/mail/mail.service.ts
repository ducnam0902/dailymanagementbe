import { TaskEntity } from './../task/task.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import envConfig from 'src/utils/config';
import getDateInCurrentTimezone from 'src/utils/time';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendEmailRegisterSuccessfully(user: UserEntity) {
    await this.mailerService.sendMail({
      from: {
        name: 'Daily Management',
        address: envConfig.EMAIL_USERNAME,
      },
      to: user.email,
      subject: 'Welcome to Daily Management! Register Successfully',
      template: './confirmation',
      context: {
        name: user.firstName + ' ' + user.lastName,
        image: envConfig.PUBLIC_API_ENDPOINT + '/logo.png',
      },
    });
  }

  async sendEmailTaskIsNotCompleted(task: TaskEntity[], user: UserEntity) {
    const isFinishedAllTasks = task.every((item) => item.isCompleted);
    const incompletedTask = task.filter((item) => !item.isCompleted);
    const completedTask = task.filter((item) => item.isCompleted);
    const today = getDateInCurrentTimezone();
    const subject = isFinishedAllTasks
      ? `[CONGRATULATIIONS - ${today} ] - Finished all tasks`
      : `[TAKE ACTION - ${today}] - Remaining tasks`;
    await this.mailerService.sendMail({
      from: {
        name: 'Daily Management',
        address: envConfig.EMAIL_USERNAME,
      },
      to: user.email,
      subject: subject + ' | Daily Management Application',
      template: './dailyTaskNotCompleted',
      context: {
        name: user.firstName + ' ' + user.lastName,
        image: envConfig.PUBLIC_API_ENDPOINT + '/logo.png',
        incompletedTask: incompletedTask,
        haveTaskCompleted: completedTask.length !== 0,
        completedTask: completedTask,
        isFinishedAllTask: isFinishedAllTasks,
      },
    });
  }

  async sendEmailTaskToday(task: TaskEntity[], user: UserEntity) {
    const today = getDateInCurrentTimezone(null, 'DD MMMM YYYY');
    const subject = `[${today}] Start a new day with your tasks!`;
    await this.mailerService.sendMail({
      from: {
        name: 'Daily Management',
        address: envConfig.EMAIL_USERNAME,
      },
      to: user.email,
      subject: subject + '| Daily Management Application',
      template: './dailyTask',
      context: {
        name: user.firstName + ' ' + user.lastName,
        image: envConfig.PUBLIC_API_ENDPOINT + '/logo.png',
        task: task,
      },
    });
  }
}
