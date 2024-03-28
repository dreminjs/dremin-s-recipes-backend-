import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export const getEMailConfig = async (
  configService: ConfigService,
): Promise<any> => {
  return {
    template: {
      adapter: new EjsAdapter(),
      options: {
        strict: false,
      },
    },
    transport: {
      host: 'smtp.gmail.com',
      secure: true,
      auth: {
        user: configService.get('USER_EMAIL'),
        pass: configService.get('USER_APP_PASS'),
      },
    },
  };
};
