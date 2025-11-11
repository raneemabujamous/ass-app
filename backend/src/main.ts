import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import cors from '@fastify/cors';
import { useContainer } from 'class-validator';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {  Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // new FastifyAdapter(),
  );
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableShutdownHooks();


  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  );
  
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();



  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);


  const port = 8081;
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running at http://localhost:${port}`);
}
bootstrap();
