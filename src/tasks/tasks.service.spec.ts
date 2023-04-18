import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetFilteredTaskDto } from '../tasks/dto/get-filtered-task.dto';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';

const mockUser: User = {
  id: 1,
  username: 'Richard',
  password: '',
  tasks: [],
  comparePassword: (candidatePassword: string, userPassword: string) =>
    Promise.resolve(true),
  hashpassword: () => Promise.resolve(),
};

const mockTaskRepository = () => ({
  getAllTasks: jest.fn(),
  findOneBy: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

describe('Task Service', () => {
  let taskService: TasksService;
  let taskRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe(`getTasks`, () => {
    it(`Should get all tasks from the repository`, async () => {
      // because getAllTasks() returns a promise we use mockResolvedValue() instead of mockReturnedValue()
      taskRepository.getAllTasks.mockResolvedValue('tasks');

      expect(taskRepository.getAllTasks).not.toHaveBeenCalled();

      const filterDto: GetFilteredTaskDto = {
        searchTerm: 'foo',
        status: TaskStatus.IN_PROGRESS,
      };

      const tasks = await taskService.getTasks(filterDto, mockUser);

      expect(taskRepository.getAllTasks).toHaveBeenCalled();
      expect(tasks).toBe('tasks');
    });
  });

  describe(`get Tasks by id`, () => {
    it(`Should return successfully return a task with the given id`, async () => {
      const mockTask = {
        id: 1,
        title: 'Tesk Task',
        description: 'Another dummy task',
      };
      taskRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOneBy).toHaveBeenCalledWith({
        id: mockTask.id,
        userId: mockUser.id,
      });
    });

    it(`Should throw an error when task with id is not found`, () => {
      taskRepository.findOneBy.mockResolvedValue(null);

      expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(`Create Task`, () => {
    it(`Should create a new task`, async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'new task',
        description: 'task description',
      };
      taskRepository.createTask.mockResolvedValue({
        id: 1,
        title: createTaskDto.title,
        description: createTaskDto.description,
      });
      const result = await taskService.createTask(createTaskDto, mockUser);
      expect(result.title).toBe(createTaskDto.title);
      expect(result.description).toBe(createTaskDto.description);
    });
  });

  describe(`deleteTask`, () => {
    it(`Should delete the task from the repository`, () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(() => taskService.deleteTask(1, mockUser)).not.toThrow();
    });

    it(`Should throw an exception when task is not found in the database`, () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(`updateStatus`, () => {
    it(`Should update the status in the db and return updated task`, async () => {
      const taskStub = {
        id: 1,
        title: 'Task',
        description: 'another task',
        status: TaskStatus.OPEN,
      };

      taskRepository.findOneBy.mockResolvedValue(taskStub);
      const newStatus: TaskStatus = TaskStatus.IN_PROGRESS;
      taskRepository.save.mockResolvedValue({ ...taskStub, status: newStatus });

      const result = await taskService.updateStatus(1, newStatus, mockUser);

      expect(result).toBeDefined();
      expect(result.status).toEqual(newStatus);
    });

    it(`Should throw an exception if the task isn't present in the db`, async () => {
      const newStatus: TaskStatus = TaskStatus.DONE;
      taskRepository.findOneBy.mockResolvedValue(null);
      expect(taskRepository.save).toBeCalledTimes(0);
      expect(taskService.updateStatus(1, newStatus, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
