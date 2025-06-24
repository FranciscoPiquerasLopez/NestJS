import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/core/jwt.guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('dataUser')
  getUser(): string {
    return 'Hello user';
  }
}
