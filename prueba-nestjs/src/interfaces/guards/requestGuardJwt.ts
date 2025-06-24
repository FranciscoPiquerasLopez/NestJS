import { Request } from 'express';

export interface RequestGuardJwt extends Request {
  user: { userId: number; email: string };
}
