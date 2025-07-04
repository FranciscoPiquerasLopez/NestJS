import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global() // <- Todo lo exportado es visible en toda la app
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env'],
    }), // para acceder desde cualquier parte
    JwtModule.register({
      // Registrar la misma configuración de firma del access token
      // en toda la APP
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [JwtModule], // JwtService disponible a nivel de APP
})
export class GlobalJwtConfiguration {}
