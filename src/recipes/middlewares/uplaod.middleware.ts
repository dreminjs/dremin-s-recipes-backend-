import { Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadMiddleware implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './static',
        filename: (req: any, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = file.originalname.split('.').pop();
          const filename = `${uuidv4()}-${uniqueSuffix}.${extension}`;
          req.filename = filename; // Сохраняем имя файла в свойстве filename объекта req
          cb(null, filename);
        },
      }),
    };
  }
}
