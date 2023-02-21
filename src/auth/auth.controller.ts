import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentials: AuthCredentialsDto) {
    console.log(authCredentials);
  }
}
