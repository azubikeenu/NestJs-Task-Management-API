import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { GetFilteredTaskDto } from './dto/get-filtered-task.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getAllTasks({
    searchTerm,
    status,
  }: GetFilteredTaskDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (searchTerm) {
      query.andWhere(
        '(task.description iLIKE :searchTerm OR task.title iLIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
