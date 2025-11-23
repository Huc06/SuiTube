import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // CORS
  const corsOrigin = configService.get<string>('app.corsOrigin') || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('SuiTube API')
    .setDescription('Decentralized Video Platform API - Built on Sui Blockchain')
    .setVersion('1.0')
    .addTag('videos', 'Video operations')
    .addTag('users', 'User operations')
    .addTag('comments', 'Comment operations')
    .addTag('subscriptions', 'Subscription operations')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('app.port') || 3001;
  await app.listen(port);
  
  console.log(`🚀 SuiTube Backend is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
