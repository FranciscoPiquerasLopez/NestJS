import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserEntity } from './entities/register.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { checkPasswordUser } from 'src/utils/crypto.utils';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;

  constructor(
    @InjectRepository(RegisterUserEntity)
    private registerUserRepository: Repository<RegisterUserEntity>,
  ) {
    // Construir el token con mi secreto y expiraciónAdd commentMore actions
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' } as JwtSignOptions,
    });
  }

  @Post()
  async registerUser(user: RegisterDto) {
    // Creamos la instancia
    const userEntity = this.registerUserRepository.create(user);
    // Buscamos por correo por si hay un correo repetido
    const existingEmail = await this.registerUserRepository.findOneBy({
      correo_usuario: user.correo_usuario,
    });
    if (existingEmail) {
      // Correo ya registrado
      // Al lanzar este error, Nest lo capturará y lanzará
      // automáticamente un 409
      // Si no, pues caerá el fallo en el filtro global
      // y mostrará un error 500
      throw new ConflictException('Correo ya registrado');
    }
    // Si no existe, no está duplicado, se guarda
    return this.registerUserRepository.save(userEntity);
  }

  @Post()
  async loginUser(user: LoginDto) {
    const userDb = await this.registerUserRepository.findOneBy({
      correo_usuario: user.correo_usuario,
    });
    // Check si existe usuario para evitar el 'undefined'
    if (userDb) {
      const matchPassword = await checkPasswordUser(
        user.contraseña_usuario,
        userDb.contraseña_usuario,
      );
      if (matchPassword) {
        // Payload del token
        const payload = {
          sub: userDb.usuario_id,
          email: userDb.correo_usuario,
        };
        // Generamos token
        const token = this.jwtService.sign(payload);
        // Devolvemos token
        return token;
      } else {
        // 401 Unauthorized
        throw new UnauthorizedException('Contraseña incorrecta');
      }
    } else {
      // 404 Not Found
      throw new NotFoundException('Usuario no encontrado en la DB');
    }
  }
}
