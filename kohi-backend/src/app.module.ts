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
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { RolesGuard } from './auth/passport/role.guard';
import { CommentsModule } from './comments/comments.module';
import { ChatModule } from './chat/chat.module';
import { EventsModule } from './events/events.module';
import { FollowsModule } from './follows/follows.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URI), // MongoDB
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ), // Config
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'frontend-dist'), // Serving build file
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

  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard
    }
  ],
})

export class AppModule { }