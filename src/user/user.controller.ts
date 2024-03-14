import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenJwt } from 'src/auth/guards/AccessTokenJwt.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(AccessTokenJwt)
  async getCurrentUserInfo(@Req() { user }) {
    return await this.userService.findUserByEmail(user.email);
  }
}
