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
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/tast-status-validation.pipe';
import { GetFilteredTaskDto } from './dto/get-filtered-task.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filteredTask: GetFilteredTaskDto,
  ): Promise<Task[]> {
    return this.taskService.getTasks(filteredTask);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() newTask: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(newTask);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @HttpCode(204)
  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    this.taskService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateStatus(id, status);
  }
}
