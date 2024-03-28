import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { TokenService } from './helpers/token.service';
import { SingUpGuard } from './guards/Sign-up.guard';
import { SingInGuard } from './guards/Sign-in.guard';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenJwt } from './guards/AccessTokenJwt.guard';
import { RefreshTokenJwt } from './guards/RefreshTokenJwt.guard';
import { AdminService } from 'src/admin/admin.service';
import { EMailService } from 'src/mail/email.service';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly mailService: EMailService,
  ) {}

  @UseGuards(SingUpGuard)
  @Post('signup')
  async signup(@Body() body: SignUpDto, @Res({ passthrough: true }) res) {
    const user = await this.authService.signUp(body);

    const tokens = await this.tokenService.generateTokens(user.email, user.id);

    await this.mailService.sendMail(body.email, user.activationLink);

    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return user;
  }

  @UseGuards(SingInGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: SignInDto, @Res({ passthrough: true }) res) {
    const user = await this.userService.findUserByEmail(body.email);

    this.logger.log(body.email, 'HIT SIGNIN');

    const tokens = await this.tokenService.generateTokens(body.email, user.id);

    await this.tokenService.removeToken(user.id);

    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return user;
  }

  @Get('refresh')
  @UseGuards(RefreshTokenJwt)
  async refresh(@Req() req, @Res({ passthrough: true }) res) {
    const { userId, email, isActivated } = req.user;

    await this.tokenService.removeToken(userId);

    const isAdmin = await this.adminService.isAdmin(email);

    const tokens = await this.tokenService.generateTokens(email, userId);

    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { isAuth: true, isAdmin, isActivated };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessTokenJwt)
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    this.logger.log(req.user.userId);

    await this.authService.logout(req.user.userId);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  @Get('checkAdminStatus')
  @UseGuards(AccessTokenJwt)
  async checkAdminStatus(@Req() req) {
    const isAdmin = await this.adminService.isAdmin(req.user.email);
    return {
      isAdmin,
    };
  }

  @Get('confirmAccount/:link')
  async confirmAccount(
    @Param('link') link: string,
    @Res({ passthrough: true }) res,
  ) {
    await this.authService.confirmAccount(link);
    res.set('Content-Type', 'text/html');

    this.logger.log(__dirname);
    return '<h1>Вы упешно подтвердили свой email!</h1>';
  }
}
