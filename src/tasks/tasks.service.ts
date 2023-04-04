import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTaskDto } from './dto/get-filtered-task.dto';
import { TaskRepository } from './task.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getTasks(filteredTask: GetFilteredTaskDto, user: User): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filteredTask, user);
  }

  async createTask(creatTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create(creatTaskDto);
    task.user = user;
    task.status = TaskStatus.OPEN;
    return await this.taskRepository.save(task);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const [task] = await this.taskRepository.find({
      where: { id, userId: user.id },
    });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }
  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0)
      throw new NotFoundException(`Task with id ${id} not found`);
  }

  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
