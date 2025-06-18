import { Body, Controller, Res } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { hashPassword } from 'src/utils/crypto.utils';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse } from 'express';

const REFRESH_DAYS = 14;
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
    @Res() res: ExpressResponse,
  ): Promise<void> {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(user);
    // Refresh token se devuelve por cookie HttpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh', // Para decirle al navegador que te adjunte esta cookie en esta petición
      maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
    });
    // Access token lo devolvemos por JSON
    res.json({ accessToken });
  }
}
