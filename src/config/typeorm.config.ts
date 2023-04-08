import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from '../tasks/task.entity';
import { User } from '../auth/user.entity';
import * as config from 'config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || config.get<string>('db.host'),
  port: Number(process.env.DB_PORT) || config.get<number>('db.port'),
  username: process.env.DB_USERNAME || config.get('db.username'),
  password: process.env.DB_PASSWORD || config.get('db.password'),
  database: process.env.DB_DATABASE_NAME || config.get('db.database'),
  entities: [Task, User],
  synchronize:
    Boolean(process.env.DB_TYPE_ORM_SYNC) || config.get('db.synchronize'),
};
