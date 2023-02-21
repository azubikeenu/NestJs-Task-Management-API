import { Expose, Transform } from 'class-transformer';

export class TaskDto {
  @Expose()
  id: number;
  @Expose()
  description: string;
  @Expose()
  title: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.id)
  userId: number;
}
