import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GetFilteredTaskDto } from './dto/get-filtered-task.dto';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private readonly logger = new Logger('TaskRepository');
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.create({
      title,
      description,
      userId: user.id,
    });
    const savedTask = await this.save(task);
    return savedTask;
  }
  async getAllTasks(
    { searchTerm, status }: GetFilteredTaskDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (searchTerm) {
      query.andWhere(
        '(task.description iLIKE :searchTerm OR task.title iLIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(err?.stack);
      throw new InternalServerErrorException(
        `failed to perform query operation`,
      );
    }
  }
}
