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

  // Support up to 50MB JSON payloads for base64 image uploads
  const express = require('express');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Set global API prefix for all NestJS REST controllers (/api/books, /api/events, /api/bookings, /api/settings)
  app.setGlobalPrefix('api');

  const clientDistPath = path.resolve(__dirname, '../../../client/dist');
  if (fs.existsSync(clientDistPath)) {
    app.useStaticAssets(clientDistPath);
    console.log(`🌐 Serving static React frontend from ${clientDistPath}`);
  }

  // Handle SPA secret routes (/admin, /admin/*, /portal) on Express adapter
  const httpAdapter = app.getHttpAdapter();
  if (fs.existsSync(clientDistPath)) {
    const sendIndex = (req: any, res: any) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    };

    httpAdapter.get('/admin', sendIndex);
    httpAdapter.get('/admin/*', sendIndex);
    httpAdapter.get('/portal', sendIndex);
    httpAdapter.get('/portal/*', sendIndex);
  }

  const port = process.env.PORT || 5001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
