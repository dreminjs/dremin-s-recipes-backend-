import { Injectable, Logger } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadMiddleware implements MulterOptionsFactory {
  private logger = new Logger(UploadMiddleware.name);

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './static',
        filename: (req: any, file, cb) => {
          this.logger.log(file);

          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = file.originalname.split('.').pop();
          const filename = `${uuidv4()}-${uniqueSuffix}.${extension}`;

          req.filename = filename;
          cb(null, filename);
        },
      }),
    };
  }
}
