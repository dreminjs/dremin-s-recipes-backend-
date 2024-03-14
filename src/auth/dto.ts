import { IsEmail, IsString, Max, Min } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;
  @Min(3)
  @Max(50)
  @IsString()
  username: string;
  @Min(3)
  @Max(50)
  @IsString()
  password: string;
}

export class SignInDto {
  @IsEmail()
  email: string;
  @Min(3)
  @Max(50)
  @IsString()
  password: string;
}
