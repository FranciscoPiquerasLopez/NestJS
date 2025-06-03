import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

// Si pones export {} es como crear tu propio scope
// es decir, esta clase tendría sería su propio 'module'
