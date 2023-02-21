import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from '../src/tasks/task.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5431,
  username: 'admin',
  password: 'userpass',
  database: 'taskmanagement',
  entities: [Task],
  synchronize: true,
};
