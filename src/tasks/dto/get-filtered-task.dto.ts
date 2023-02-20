import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task.model';
export class GetFilteredTaskDto {
  @IsOptional()
  @IsNotEmpty()
  searchTerm: string;
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;
}
