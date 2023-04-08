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
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  async comparePassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  @BeforeInsert()
  async hashpassword(): Promise<void> {
    if (!this.id) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }
}
