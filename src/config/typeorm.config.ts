import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from '../tasks/task.entity';
import { User } from '../auth/user.entity';
import * as config from 'config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: config.get<number>('db.port'),
  username: 'admin',
  password: 'userpass',
  database: 'taskmanagement',
  entities: [Task, User],
  synchronize: true,
};
