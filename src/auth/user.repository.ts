import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger = new Logger('user_repository');
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
        this.logger.error(err?.stack);
        throw new InternalServerErrorException(
          'failed to persist user to the database',
        );
      }
    }
  }

  async validatePassword({ username, password }: AuthCredentialsDto) {
    try {
      const user = await this.findOneBy({ username });
      if (user && (await user.comparePassword(password, user.password))) {
        return user.username;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error(error?.stack);
      throw new InternalServerErrorException(`failed to validate credentials`);
    }
  }
}
