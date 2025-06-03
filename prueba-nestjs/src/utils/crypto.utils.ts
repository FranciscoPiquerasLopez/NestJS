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
