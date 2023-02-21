import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(authCredentials: AuthCredentialsDto) {
    const user = await this.userRepository.saveUser(authCredentials);
    return user;
  }
}
