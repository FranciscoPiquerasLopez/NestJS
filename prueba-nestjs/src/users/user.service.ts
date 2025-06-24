import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserEntity } from 'src/auth/entities/register.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(RegisterUserEntity)
    private registerUserRepository: Repository<RegisterUserEntity>,
  ) {}

  async getUser(userId: number): Promise<RegisterUserEntity> {
    const userEntity = await this.registerUserRepository.findOneBy({
      usuario_id: userId,
    });
    if (!userEntity) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return userEntity;
  }
}
