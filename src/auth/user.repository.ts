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

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = this.create({ username, password });
    try {
      await this.save(user);
    } catch (error) {
      if ((error.code = '23505')) {
        throw new ConflictException('username already exists');
      } else {
        throw new InternalServerErrorException('Something wrong happened');
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
