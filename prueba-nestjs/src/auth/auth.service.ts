import { Injectable, ConflictException, Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserEntity } from './entities/register.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { validateUser } from 'src/utils/validateUser';
import { RefreshTokenEntity } from './entities/refreshToken.entity';
import { randomBytes } from 'crypto';

// Constantes
const ACCESS_EXPIRES = '1h';
const REFRESH_DAYS = 14;

@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;

  constructor(
    @InjectRepository(RegisterUserEntity)
    private registerUserRepository: Repository<RegisterUserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {
    // Construir el token con mi secreto y expiraciónAdd commentMore actions
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: ACCESS_EXPIRES } as JwtSignOptions,
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
  async refreshToken() {}
}
