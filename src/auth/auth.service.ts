import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { AccessToken } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsDto) {
    const user = await this.userRepository.saveUser(authCredentials);
    return user;
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<AccessToken> {
    const username = await this.userRepository.validatePassword(
      authCredentials,
    );
    if (!username) throw new UnauthorizedException('Invalid Credentials!');
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
