import { Controller, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post()
  postUser(): string {
    return 'Hello user';
  }
}
