import { AuthGuard } from '@nestjs/passport';

export class RefreshTokenJwt extends AuthGuard('RefreshTokenStrategy') {}
