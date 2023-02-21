import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTaskDto } from './dto/get-filtered-task.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getTasks(filteredTask: GetFilteredTaskDto): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filteredTask);
  }

  async createTask(creatTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(creatTaskDto);
    return await this.taskRepository.save(task);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`Task with id ${id} not found`);
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
