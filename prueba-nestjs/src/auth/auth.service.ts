import { Injectable, HttpException } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserEntity } from './entities/register.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { checkPasswordUser } from 'src/utils/crypto.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RegisterUserEntity)
    private registerUserRepository: Repository<RegisterUserEntity>,
  ) {}

  @Post()
  async registerUser(user: RegisterDto) {
    try {
      // Creamos la instancia
      const userEntity = this.registerUserRepository.create(user);
      // Buscamos por correo por si hay un correo repetido
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
  async loginUser(user: LoginDto) {
    try {
      const userDb = await this.registerUserRepository.findOneBy({
        correo_usuario: user.correo_usuario,
      });
      // Check si existe usuario para evitar el 'undefined'
      if (userDb) {
        const matchPassword = await checkPasswordUser(
          user.contraseña_usuario,
          userDb.contraseña_usuario,
        );
        // TODO: Recuperar el token
      } else {

      }
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }
}
