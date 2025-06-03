import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class RegisterUserEntity {
  @PrimaryGeneratedColumn()
  usuario_id: number;

  @Column({ unique: true })
  correo_usuario: string;

  @Column()
  contraseña_usuario: string;
}
