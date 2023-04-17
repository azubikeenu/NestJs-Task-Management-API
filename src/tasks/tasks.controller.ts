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
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/tast-status-validation.pipe';
import { GetFilteredTaskDto } from './dto/get-filtered-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  private readonly Logger = new Logger('TaskController');
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filteredTask: GetFilteredTaskDto,
    @CurrentUser() user: User,
  ): Promise<Task[]> {
    return this.taskService.getTasks(filteredTask, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() newTask: CreateTaskDto,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(newTask, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @HttpCode(204)
  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    this.Logger.log('Deleting task');
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateStatus(id, status, user);
  }
}
