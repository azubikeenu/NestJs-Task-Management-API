import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5431,
  username: 'admin',
  password: 'userpass',
  database: 'taskmanagement',
  entities: [__dirname + '../**/*.entity.ts'],
  synchronize: true,
};
