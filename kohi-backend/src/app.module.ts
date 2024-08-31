import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kohi'), // MongoDB
    ConfigModule.forRoot(), // Config
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'kohi-frontend', 'dist') // Serving build file
    }),
    PostsModule, UsersModule, FollowsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
