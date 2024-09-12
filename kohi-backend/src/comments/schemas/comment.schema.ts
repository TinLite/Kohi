import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Comment {
  @Prop()
  author: string;
  @Prop()
  content: string;
  @Prop()
  postId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  replyTo?: Comment;
  @Prop({ default: Date.now() })
  timeStamp: Date;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  likes: User[];
  @Prop()
  hasReply?: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
