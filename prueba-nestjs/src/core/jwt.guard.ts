import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request as RequestExpress } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1) Obtener petición HTTP
    const request = context.switchToHttp().getRequest<RequestExpress>();
    // 2) Extraer lo que se desee (headers, params, body, etc...)
    const authHeader = request.headers['authorization']; // string | undefined
    // 3) Comprobamos que existe el encabezado Authorization en el request
    if (!authHeader) {
      throw new UnauthorizedException('Falta encabezado Authorization');
    }
    // 4) Comprobamos formato del token
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido');
    }
    // 5) Validar el token con JwtService
    try {
      // Verificar firma y expiración del token
      const payload = this.jwtService.verify<TokenPayload>(token);
      // Guardar el payload decodificado en req.user
      request.user = { userId: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}

// Forma del payload del token que genera mi servidor
interface TokenPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}
