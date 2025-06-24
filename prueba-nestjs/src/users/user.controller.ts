import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/core/jwt.guard';
import { RequestGuardJwt } from 'src/interfaces/guards/requestGuardJwt';
import { UserService } from './user.service';
import { RegisterUserEntity } from 'src/auth/entities/register.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('dataUser')
  async getUser(@Req() req: RequestGuardJwt): Promise<RegisterUserEntity> {
    // Id del usuario que hace la petición
    const userId = req.user.userId;
    const userEntity = await this.userService.getUser(userId);
    return userEntity;
  }
}
