import {
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenJwt } from 'src/auth/guards/AccessTokenJwt.guard';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(AccessTokenJwt)
  async getCurrentUserInfo(@User() { email }) {
    return await this.userService.findUserByEmail(email);
  }

  @Get('/:id')
  async getOtherUserInfo(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserById(id);
  }

  @Get('checkOwnerProfile/:id')
  @UseGuards(AccessTokenJwt)
  async checkOwnerProfile(
    @Param('id', ParseIntPipe) profileId: number,
    @User() { userId },
  ) {
    return { isItMineProfile: profileId === userId };
  }
}
