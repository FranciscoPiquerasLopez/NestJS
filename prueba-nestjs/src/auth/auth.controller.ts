import { Body, Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RegisterUserEntity } from './entities/register.entity';
import { hashPassword } from 'src/utils/crypto.utils';

@Controller('users')
export class AuthController {
  constructor(private userService: AuthService) {}

  @Post('register')
  async registerUser(@Body() user: RegisterDto): Promise<RegisterUserEntity> {
    const hashedPassword = await hashPassword(user.contraseña_usuario);
    const userWithHashedPassword: RegisterDto = {
      correo_usuario: user.correo_usuario,
      contraseña_usuario: hashedPassword,
    };
    const userEntityPromise = await this.userService.registerUser(
      userWithHashedPassword,
    );
    return userEntityPromise;
  }
}
