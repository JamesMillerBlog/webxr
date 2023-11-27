import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplicationContext } from '@nestjs/common';

export async function bootstrapLambda(): Promise<INestApplicationContext> {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();
  return app;
}
