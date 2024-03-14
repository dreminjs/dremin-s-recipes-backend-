import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { PasswordService } from '../helpers/password.service';

@Injectable()
export class SingInGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body; // Получаем пароль из req.body

    const candidate: any = await this.userService.findUserByEmail(email);

    if (!candidate) {
      throw new UnauthorizedException(
        "Такой пользователь с таким email'ом не существует",
      );
    }

    const isValidPassword = await this.passwordService.comparePassword(
      password,
      candidate.hashPassword,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('не верный пароль!');
    }

    return true;
  }
}
