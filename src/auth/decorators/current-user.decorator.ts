import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): User => {
    // --- the first param is the argument passed to the decorator , the second param is the execution context
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
