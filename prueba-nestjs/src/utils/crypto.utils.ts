import * as bcrypt from 'bcrypt';

export async function hashPassword(contraseña: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hasheo contraseña ${(error as Error).message}`);
  }
}

export async function checkPassword(
  contraseñaTextoPlanoLogin: string,
  contraseñaEncriptadaDb: string,
): Promise<boolean> {
  try {
    const result = bcrypt.compare(
      contraseñaTextoPlanoLogin,
      contraseñaEncriptadaDb,
    );
    return result;
  } catch (error) {
    throw new Error(
      `Error comprobar contraseña encriptada ${(error as Error).message}`,
    );
  }
}
