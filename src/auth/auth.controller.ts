import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AccessToken } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentials: AuthCredentialsDto) {
    return this.authservice.signUp(authCredentials);
  }

  @HttpCode(200)
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto,
  ): Promise<AccessToken> {
    return this.authservice.signIn(authCredentials);
  }
}
