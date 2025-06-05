import * as jwt from 'jsonwebtoken';

type UserDb = {
  usuario_id: number;
  correo_usuario: string;
  contraseña_usuario: string;
};
export function generateToken(user: UserDb) {
  // 1. Crear payload con la info necesaria
  const payload = {
    sub: user.usuario_id,
    email: user.correo_usuario,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expira en 1 hora
  };
  // 2. Firmar el JWT con la clave secreta (NO COMPARTIR)
  const jwtSecret: string = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, jwtSecret);

  // 3. Enviar token
  return token;
}
