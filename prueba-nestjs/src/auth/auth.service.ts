import { Injectable, HttpException } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UserAuthDto } from './dto/userAuth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserEntity } from './entities/register.entity';
import { Repository } from 'typeorm';
import { checkPassword } from 'src/utils/crypto.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RegisterUserEntity)
    private registerUserRepository: Repository<RegisterUserEntity>,
  ) {}

  @Post()
  async registerUser(user: UserAuthDto) {
    try {
      const userEntity = this.registerUserRepository.create(user);
      const existingEmail = await this.registerUserRepository.findOneBy({
        correo_usuario: user.correo_usuario,
      });
      if (existingEmail) {
        // Correo ya registrado
        throw new Error('registro no permitido');
      }
      // Si no existe, no está duplicado, se guarda
      return this.registerUserRepository.save(userEntity);
    } catch (error) {
      throw new HttpException((error as Error).message, 409);
    }
  }

  @Post()
  async loginUser(user: UserAuthDto) {
    try {
      const userDb = await this.registerUserRepository.findOne({
        where: { correo_usuario: user.correo_usuario },
        select: ['correo_usuario', 'contraseña_usuario', 'usuario_id'],
      });
      const matchPassword = await checkPassword(
        user.contraseña_usuario,
        userDb!.contraseña_usuario,
      );
      if (!matchPassword) {
        throw new HttpException('Contraseña incorrecta', 401);
      }
    } catch (error) {
      throw new HttpException((error as Error).message, 409);
    }
  }
}
