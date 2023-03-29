import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  private readonly ALLOWED_STATUSES: string[] = Object.values(TaskStatus);
  transform(value: any) {
    value = value?.toUpperCase();
    if (!this.isValidStatus(value)) {
      const message = value
        ? `Invalid status ${value}!,must be one of ${this.ALLOWED_STATUSES.join(
            ' ',
          )}`
        : `status is required`;
      throw new BadRequestException(message);
    }

    return value;
  }

  private isValidStatus(status: string): boolean {
    return this.ALLOWED_STATUSES.indexOf(status) !== -1;
  }
}
