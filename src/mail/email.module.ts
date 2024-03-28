import { Module } from '@nestjs/common';
import { EMailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path, { join, resolve } from 'path';
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('USER_APP_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [EMailService],
  exports: [EMailService],
})
export class EMailModule {}

console.log(__dirname);
