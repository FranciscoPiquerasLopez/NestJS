import {
  Injectable,
  ConflictException,
  Get,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserEntity } from './entities/register.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { validateUser } from 'src/utils/validateUser';
import { RefreshTokenEntity } from './entities/refreshToken.entity';
import { randomBytes } from 'crypto';

// Constantes
const REFRESH_DAYS = 14;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RegisterUserEntity)
    private registerUserRepository: Repository<RegisterUserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
  ) {}

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
  async loginUser(
    user: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userDb = await this.registerUserRepository.findOneBy({
      correo_usuario: user.correo_usuario,
    });
    // Validamos usuario y contraseña
    await validateUser(user, userDb);
    // Payload
    const payload = {
      sub: userDb!.usuario_id,
      email: userDb!.correo_usuario,
    };
    // 1. Genera el access token
    const accessToken = this.jwtService.sign(payload);
    // 2. Genera el refresh token (aleatorio)
    const refreshToken = randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
    const createdAt = new Date(Date.now());
    // 4. Creamos entidad
    const tokenEntity = this.refreshTokenRepository.create({
      usuario: userDb!,
      token: refreshToken,
      expiresAt: expiresAt,
      createdAt: createdAt,
    });
    // 5. Guardar la entidad
    await this.refreshTokenRepository.save(tokenEntity);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @Get()
  async refreshToken(refreshTokenCookie: string): Promise<string> {
    // Buscamos si existe el refresh token del usuario en la DB
    const refreshTokenDb = await this.refreshTokenRepository.findOneBy({
      token: refreshTokenCookie,
    });
    // Existe el refresh token en la DB
    if (refreshTokenDb !== null) {
      const now = new Date();
      // Refresh token expirado --->
      if (refreshTokenDb?.expiresAt.getTime() < now.getTime()) {
        // Lo eliminamos de la DB
        await this.refreshTokenRepository.delete({
          id_token: refreshTokenDb?.id_token,
        });
        // Lanzamos error
        throw new UnauthorizedException('Refresh token expirado');
      }
      // Refresh token NO expirado --->
      const userDb = await this.registerUserRepository.findOneBy({
        usuario_id: refreshTokenDb.usuario_id,
      });
      // Payload
      const payload = {
        sub: userDb!.usuario_id,
        email: userDb!.correo_usuario,
      };
      const accessToken = this.jwtService.sign(payload);
      return accessToken;
    } else {
      throw new NotFoundException(
        'Refresh token no encontrado en la base de datos',
      );
    }
  }
}
