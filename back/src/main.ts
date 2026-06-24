import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
  );

  // 👇 AÑADE O REVISA ESTA CONFIGURACIÓN
  app.enableCors({
    origin: 'http://localhost:4200', // El puerto de tu Frontend (Angular / etc)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000); // Tu Backend
}


bootstrap();
