import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User } from 'src/auth/user.decorator';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    PostsModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService]
})
export class CommentsModule {}
