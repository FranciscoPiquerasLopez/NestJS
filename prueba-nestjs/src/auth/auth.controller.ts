import { Body, Controller, Res } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { hashPassword } from 'src/utils/crypto.utils';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() user: RegisterDto) {
    const hashedPassword = await hashPassword(user.contraseña_usuario);
    // Objeto con el correo del usuario y su contraseña pero encriptada
    const userWithHashedPassword: RegisterDto = {
      nombre_usuario: user.nombre_usuario,
      apellidos_usuario: user.apellidos_usuario,
      correo_usuario: user.correo_usuario,
      contraseña_usuario: hashedPassword,
    };
    await this.authService.registerUser(userWithHashedPassword);
    return { message: 'Registro exitoso' };
  }

  @Post('login')
  async loginUser(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.loginUser(user);
  }
}
