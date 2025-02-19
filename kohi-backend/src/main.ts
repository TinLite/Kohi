import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import RedisStore from 'connect-redis';
import session from 'express-session';
import passport from 'passport';
import { createClient } from 'redis';
import { AppModule } from './app.module';
import { CustomSocketAdapter } from './socket.adapter';

export let redisClient;
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
  const redisUrl = `redis://${configService.get('REDIS_HOST') ?? "localhost"}:${configService.get('REDIS_PORT') ?? "6379"}`;
  redisClient = createClient({
    url: redisUrl,
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'Kohi:',
  });

  const sessionMiddleware = 
  session({
    store: redisStore,
    secret: configService.get('SESSION_SECRET') ?? 'ookawaii-koto',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: Number(configService.get('SESSION_MAX_AGE') ?? '86400000'),
      secure: false,
      httpOnly: true,
    },
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  app.useWebSocketAdapter(new CustomSocketAdapter(sessionMiddleware, app))

  await app.listen(3000);
}
bootstrap();
