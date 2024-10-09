import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
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
            image: envConfig.PUBLIC_API_ENDPOINT + '/user/image/logo.png',
          },
        });
      }

}
