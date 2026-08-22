import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const clientDistPath = path.resolve(__dirname, '../../../client/dist');
  if (fs.existsSync(clientDistPath)) {
    app.useStaticAssets(clientDistPath);
    console.log(`🌐 Serving static React frontend from ${clientDistPath}`);
  }

  const port = process.env.PORT || 5001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
