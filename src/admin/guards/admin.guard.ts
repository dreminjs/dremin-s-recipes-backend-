import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  private logger = new Logger(AdminGuard.name);

  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies.refreshToken;

    const userToken = await this.prismaService.refreshToken.findFirst({
      where: { token },
    });

    const user = await this.prismaService.user.findFirst({
      where: { id: userToken.userId },
    });

    console.log(userToken);

    return user.role === 'ADMIN' && true;
  }
}
