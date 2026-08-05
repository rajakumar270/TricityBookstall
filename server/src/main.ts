import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export default async function (context: any) {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');
  await app.init();

  const req = context.req;
  const res = context.res;

  // Serve API response
  return res.json({ status: 'ok', domain: 'tricitybookstall-prabodhanam.appwrite.network' });
}
