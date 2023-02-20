import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/tast-status-validation.pipe';
import { GetFilteredTaskDto } from './dto/get-filtered-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filteredTask: GetFilteredTaskDto): Task[] {
    return this.taskService.getTasks(filteredTask);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() newTask: CreateTaskDto): Task {
    return this.taskService.createTask(newTask);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @HttpCode(204)
  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    this.taskService.deleteTask(id);
    console.log('Task deleted');
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ) {
    return this.taskService.updateStatus(id, status);
  }
}
