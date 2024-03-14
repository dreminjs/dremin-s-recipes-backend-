import { AuthGuard } from '@nestjs/passport';

export class AccessTokenJwt extends AuthGuard('AccessTokenStrategy') {}
