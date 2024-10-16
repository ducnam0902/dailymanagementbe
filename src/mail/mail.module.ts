import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import envConfig from 'src/utils/config';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envConfig.EMAIL_HOST,
        secure: true,
        auth: {
          user: envConfig.EMAIL_USERNAME,
          pass: envConfig.EMAIL_PASSWORD,
        },
      },
      defaults: {},
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
