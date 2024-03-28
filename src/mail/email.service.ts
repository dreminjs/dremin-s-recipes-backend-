import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import ejs from 'ejs';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import path, { join } from 'path';

import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './mail.interface';

import { Logger } from '@nestjs/common';
@Injectable()
export class EMailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  private logger = new Logger(EMailService.name);

  async sendMail(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        template: '',
        subject: 'Подтверждение регистрации',
        html: `
                <h3>Рецепты от Андрюхи</h3> <br/>
                <p>ваш email: ${email}</p>
                <a href="http://localhost:3000/auth/confirmAccount/${link}">Подтвердите Email!</a>
            `,
      });
    } catch (e) {
      throw new UnauthorizedException('Не получилось отправить письмо!');
    }
  }
}

console.log(__dirname);
