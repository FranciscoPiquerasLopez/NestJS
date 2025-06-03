import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  postUser(): string {
    return 'Hello user';
  }
}
