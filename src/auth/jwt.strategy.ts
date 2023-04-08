import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new UnauthorizedException('Invalid Credentials');
    return user;
  }
}
