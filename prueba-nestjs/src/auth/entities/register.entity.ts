import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RefreshTokenEntity } from './refreshToken.entity';

@Entity('usuarios')
export class RegisterUserEntity {
  @PrimaryGeneratedColumn()
  usuario_id: number;

  @Column({ unique: true })
  correo_usuario: string;

  @Column()
  contraseña_usuario: string;

  @Column()
  nombre_usuario: string;

  @Column()
  apellidos_usuario: string;

  @OneToMany(() => RefreshTokenEntity, (token) => token.usuario, {
    onDelete: 'CASCADE',
  })
  tokens: RefreshTokenEntity[];
}
