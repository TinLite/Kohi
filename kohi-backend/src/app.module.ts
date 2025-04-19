import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SessionGuard } from './auth/passport/session.guard';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommentsModule } from './comments/comments.module';
import { EventsModule } from './events/events.module';
import { FollowsModule } from './follows/follows.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';
import { ReportsModule } from './reports/reports.module';
import { RolesGuard } from './auth/passport/role.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kohi'), // MongoDB
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST') ?? 'smtp.gmail.com',
          port: configService.get<number>('MAIL_PORT') ?? 587,
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        // template: {
        //   dir: join(__dirname, 'templates'),
        //   adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
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
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: SessionGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
