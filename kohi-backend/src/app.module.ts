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
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kohi'), // MongoDB
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ), // Config
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'kohi-frontend', 'dist'), // Serving build file
    }),
    PostsModule,
    UsersModule,
    AuthModule,
    UtilsModule,
    CommentsModule,
    ChatModule,
    EventsModule,
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
