import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PostsModule } from 'src/posts/posts.module';
// import { BookmarkService } from './bookmarks.service';
// import { FollowsService } from './follows.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // NotificationsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    // BookmarkService // Tách bookmark ra đã =)
  ],
  exports: [UsersService],
})
export class UsersModule {}
