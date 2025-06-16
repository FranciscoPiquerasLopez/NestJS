import { Body, Controller, Res } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RegisterUserEntity } from './entities/register.entity';
import { hashPassword } from 'src/utils/crypto.utils';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() user: RegisterDto): Promise<RegisterUserEntity> {
    const hashedPassword = await hashPassword(user.contraseña_usuario);
    // Objeto con el correo del usuario y su contraseña pero encriptada
    const userWithHashedPassword: RegisterDto = {
      nombre_usuario: user.nombre_usuario,
      apellidos_usuario: user.apellidos_usuario,
      correo_usuario: user.correo_usuario,
      contraseña_usuario: hashedPassword,
    };
    const userEntityPromise = await this.authService.registerUser(
      userWithHashedPassword,
    );
    return userEntityPromise;
  }

  @Post('login')
  async loginUser(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    // 1) Validar usuario/contraseña y obtener token
    const token = await this.authService.loginUser(user);
    // 2) Devolvemos la cookie al cliente
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
        path: '/',
      })
      .json({ message: 'Autenticado' });
  }
}
