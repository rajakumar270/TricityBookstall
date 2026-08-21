import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for React frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 NestJS Backend running on http://0.0.0.0:${port}/api`);
}

bootstrap();
