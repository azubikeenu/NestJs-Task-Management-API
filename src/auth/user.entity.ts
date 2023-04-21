import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
  OneToMany,
  AfterLoad,
  BeforeUpdate,
} from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;

  private initialPassword: string;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  async comparePassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  @AfterLoad()
  getInitialPassword() {
    this.initialPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashpassword(): Promise<void> {
    try {
      if (this.password !== this.initialPassword) {
        this.password = await bcrypt.hash(this.password, 12);
      }
    } catch (ex) {
      throw new InternalServerErrorException(
        `Couldn't perform hashing operation`,
      );
    }
  }
}
