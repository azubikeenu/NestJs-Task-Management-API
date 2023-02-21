import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async saveUser(authCredentials: AuthCredentialsDto) {
    const user = new User();
    user.password = authCredentials.password;
    user.username = authCredentials.username;
    try {
      await user.save();
    } catch (err) {
      if ((err.code = '23505')) {
        throw new ConflictException('username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validatePassword({ username, password }: AuthCredentialsDto) {
    const user = await this.findOneBy({ username });
    if (user && (await user.comparePassword(password, user.password))) {
      return user.username;
    } else {
      return null;
    }
  }
}
