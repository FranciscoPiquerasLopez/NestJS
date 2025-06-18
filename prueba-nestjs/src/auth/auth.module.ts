import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserEntity } from './entities/register.entity';
import { RefreshTokenEntity } from './entities/refreshToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterUserEntity, RefreshTokenEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
