import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Comment } from 'src/comments/schemas/comment.schema';
import { Post } from 'src/posts/schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';

export enum NotificationFlags{
  HIDDEN = 'hidden',
}
@Schema()
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User; // người nhận đc thông báo

  @Prop()
  type: string; // loại thông báo

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post?: Post;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  otherUser?: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comment?: Comment;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  createAt: Date;
  @Prop()
  flags: NotificationFlags[];
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
