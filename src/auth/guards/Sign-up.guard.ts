import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SingUpGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body; // Получаем пароль из req.body

    const candidate: any = await this.userService.findUserByEmail(email);

    if (candidate) {
      throw new UnauthorizedException(
        "Такой пользователь с таким email'ом уже существует",
      );
    }

    return true;
  }
}
