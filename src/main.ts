import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Vagon Tamir Hisobot API')
    .setDescription('API documentation for the Vagon Tamir Hisobot system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
