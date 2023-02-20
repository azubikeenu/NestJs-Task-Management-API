import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTaskDto } from './dto/get-filtered-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(filteredTask: GetFilteredTaskDto): Task[] {
    const { searchTerm, status } = filteredTask;

    if (Object.keys(filteredTask).length === 0) return this.getAllTasks();

    let filteredTasks: Task[] = [];

    filteredTasks = searchTerm
      ? this.tasks.filter(
          (task) =>
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : filteredTasks;

    filteredTasks = [
      ...filteredTasks,
      ...this.tasks.filter((task) => task.status === status),
    ];
    return filteredTasks;
  }

  private getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  deleteTask(id: string): void {
    const foundTask = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== foundTask.id);
  }

  updateStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
