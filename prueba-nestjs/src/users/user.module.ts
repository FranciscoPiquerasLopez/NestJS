import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserEntity } from 'src/auth/entities/register.entity';
import { JwtGuard } from 'src/core/jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterUserEntity])],
  controllers: [UserController],
  providers: [UserService, JwtGuard],
})
export class UserModule {}

// Si pones export {} es como crear tu propio scope
// es decir, esta clase tendría sería su propio 'module'
