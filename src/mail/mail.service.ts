import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import  * as moment from 'moment';
import { NoteEntity } from 'src/note/note.entity';
import { UserEntity } from 'src/user/user.entity';
import envConfig from 'src/utils/config';
@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}
    async sendEmailRegisterSuccessfully(user: UserEntity) {
        await this.mailerService.sendMail({
          from: 'dailymanagementteam@gmail.com',
          to: user.email,
          subject: 'Welcome to Daily Management App! Register Successfully',
          template: './confirmation',
          context: {
            name: user.firstName + ' ' + user.lastName,
            image: envConfig.PUBLIC_API_ENDPOINT + '/logo.png',
          },
        });
      }

    async sendEmailNoteIsNotCompleted(task: NoteEntity[], user: UserEntity) {
      const isFinishedAllTasks = task.every(item => item.isCompleted );
      const incompletedTask = task.filter(item => !item.isCompleted);
      const completedTask = task.filter(item => item.isCompleted);
      const today = moment().format('DD-MMM-YYYY');
      const subject = isFinishedAllTasks ? `Congratulation! You have completed all tasks on ${today}` :
        `Reminder: You have remaining tasks that need to be done by the end of ${today}`;
      await this.mailerService.sendMail({
        from: 'dailymanagementteam@gmail.com',
        to: user.email,
        subject: subject + ' | Daily Management Application',
        template: './dailyNoteNotCompleted',
        context: {
          name: user.firstName + ' ' + user.lastName,
          image: envConfig.PUBLIC_API_ENDPOINT + '/logo.png',
          incompletedTask: incompletedTask,
          haveTaskCompleted: completedTask.length !== 0,
          completedTask: completedTask,
          isFinishedAllTask: isFinishedAllTasks,
        },
      })
    }

}
