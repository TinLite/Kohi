import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import session from 'express-session';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('/v1/api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  //connect redis
  const redisUrl = `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`;
  let redisClient = createClient({
    url: redisUrl,
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'Kohi:',
  });

  app.use(
    session({
      store: redisStore,
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: Number(configService.get('SESSION_MAX_AGE')),
        secure: false,
        httpOnly: true,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
