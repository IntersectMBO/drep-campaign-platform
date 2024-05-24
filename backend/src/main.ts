import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Set global prefix to '/api'
  app.enableCors();
  await app.listen(8000);
}
bootstrap().then();
