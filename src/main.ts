import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { HttpStatus } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  // Register PrismaClientExceptionFilter to handle Prisma Client exceptions
  // and map them to appropriate HTTP status codes
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      // Prisma Error Code: HTTP Status Response
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );

  // Enable CORS for all routes
  // allow all origins
  app.enableCors();

  // Set global prefix for all routes in the application "/api"
  app.setGlobalPrefix('api');

  // Swagger API documentation setup start
  const config = new DocumentBuilder()
    .setTitle('Budget Buddy API')
    .setDescription('Your Budget,Your Rules')
    .setVersion('1.0')
    .addTag('BudgetBuddy', 'Manage your budget, your budget, your rules')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  // Swagger API documentation setup end

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
