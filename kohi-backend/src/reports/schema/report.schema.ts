import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Comment } from 'src/comments/schemas/comment.schema';
import { Post } from 'src/posts/schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';
export enum ReportFlags {
  HIDDEN = 'hidden',
}
@Schema()
export class Report {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: Post;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  commentId: Comment;
  @Prop()
  reason: string;
  @Prop({ default: Date.now })
  timeStamp: Date;
  @Prop()
  flags: ReportFlags[];
}
export const ReportSchema = SchemaFactory.createForClass(Report);
