import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('/v1/api');
  // app.enableCors({
  //   origin: '*',
  // });
  app.enableCors({
    origin: true, // Địa chỉ frontend của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Nếu bạn cần gửi cookie
  });
  await app.listen(3000);
}
bootstrap();
