import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AccessToken } from './types/auth.types';
import { Serialize } from 'interceptors/serialize.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';

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

  @UseGuards(AuthGuard())
  @Serialize(UserDto)
  @Get('/whoAmI')
  async test(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
