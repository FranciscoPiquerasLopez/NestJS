import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitar las CORS de forma abierta
  app.use(cookieParser()); // Parsear cookie
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
