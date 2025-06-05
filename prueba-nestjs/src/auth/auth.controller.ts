import { Body, Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UserAuthDto } from './dto/userAuth.dto';
import { AuthService } from './auth.service';
import { RegisterUserEntity } from './entities/register.entity';
import { hashPassword } from 'src/utils/crypto.utils';

@Controller('users')
export class AuthController {
  constructor(private userService: AuthService) {}

  @Post('register')
  async registerUser(@Body() user: UserAuthDto): Promise<RegisterUserEntity> {
    // Encriptamos contraseña
    const hashedPassword = await hashPassword(user.contraseña_usuario);
    // Objeto con el correo del usuario y su contraseña pero encriptada
    const userWithHashedPassword: UserAuthDto = {
      correo_usuario: user.correo_usuario,
      contraseña_usuario: hashedPassword,
    };
    // Endpoint que crea una instancia a partir del objeto userWithHashedPassword
    // y hace un save() para guardarlo en la base de datos
    const userEntityPromise = await this.userService.registerUser(
      userWithHashedPassword,
    );
    // Devolvemos la entidad(usuario) guardada en la base de datos
    return userEntityPromise;
  }

  @Post('login')
  async loginUser(@Body() user: UserAuthDto): Promise<string> {
    // Obtenemos el JWT Token del endpoint del login de usuario
    const jsonWebToken = await this.userService.loginUser(user);
    return jsonWebToken;
  }
}
