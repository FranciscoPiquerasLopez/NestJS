import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegisterUserEntity } from './register.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id_token: number;

  // 1️⃣ la relación ManyToOne
  @ManyToOne(() => RegisterUserEntity, (usuario) => usuario.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: RegisterUserEntity;

  // 2️⃣ el “campo sombra” que refleja la FK
  @Column({ name: 'usuario_id' })
  usuario_id: number;

  @Column()
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
