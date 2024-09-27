import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    PostsModule
  ]
  ,  
  controllers: [BookmarksController],
  providers: [BookmarkService],
})
export class BookmarksModule {}
