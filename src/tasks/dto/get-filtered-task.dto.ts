import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
export class GetFilteredTaskDto {
  @IsOptional()
  @IsNotEmpty()
  searchTerm: string;
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;
}
