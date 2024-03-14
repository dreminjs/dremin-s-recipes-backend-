import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hashPassword: string) {
    console.log(password, hashPassword);

    return await bcrypt.compare(password, hashPassword);
  }
}
