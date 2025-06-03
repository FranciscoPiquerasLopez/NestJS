import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserEntity } from './entities/register.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterUserEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
