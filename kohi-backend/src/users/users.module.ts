import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { User } from './schemas/user.schema';
import { FollowsService } from './follows.service';
import { BookmarkService } from './bookmarks.service';
import { PostsService } from 'src/posts/posts.service';
import { PostsModule } from 'src/posts/posts.module';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PostsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService,FollowsService,BookmarkService,PostsService],
  exports: [UsersService,FollowsService],
})
export class UsersModule {}
