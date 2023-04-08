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

  async getTasks(filterDto: GetFilteredTaskDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getAllTasks(filterDto, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id, userId: user.id });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async deleteTask(id: number, user: User) {
    const { affected } = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (affected === 0)
      throw new NotFoundException(
        `Could not delete! Task with id ${id} not found `,
      );
  }

  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const foundTask = await this.getTaskById(id, user);
    const updatedTask = { ...foundTask, status };
    return await this.taskRepository.save(updatedTask);
  }
}
