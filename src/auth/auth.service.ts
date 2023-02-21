import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    const user = this.userRepository.create(authCredentials);
    await user.save();
  }
}
