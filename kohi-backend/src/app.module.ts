import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { RolesGuard } from './auth/passport/role.guard';
import { CommentsModule } from './comments/comments.module';
import { ChatModule } from './chat/chat.module';
import { EventsModule } from './events/events.module';
import { FollowsModule } from './follows/follows.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kohi'), // MongoDB
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostsModule,
    UsersModule,
    AuthModule,
    UtilsModule,
    CommentsModule,
    ChatModule,
    EventsModule,
    FollowsModule,
    BookmarksModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
