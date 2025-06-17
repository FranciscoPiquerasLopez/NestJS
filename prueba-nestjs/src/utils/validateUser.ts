import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserEntity } from 'src/auth/entities/register.entity';
import { checkPasswordUser } from './crypto.utils';
import { LoginDto } from 'src/auth/dto/login.dto';

export async function validateUser(
  user: LoginDto,
  userDb: RegisterUserEntity | null,
): Promise<boolean> {
  if (userDb) {
    const matchPassword = await checkPasswordUser(
      user.contraseña_usuario,
      userDb.contraseña_usuario,
    );
    if (matchPassword) {
      return true;
    } else {
      // 401 Unauthorized
      throw new UnauthorizedException('Contraseña incorrecta');
    }
  } else {
    // 404 Not Found
    throw new NotFoundException('Usuario no encontrado en la DB');
  }
}
