import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Comment {
@Prop()
 author : string;
  @Prop()
  content: string;
  @Prop()
  postId: string;
  @Prop({default: null})
  replyTo?: string;
  @Prop({default: Date.now()})
  timeStamp: Date;
  @Prop({default: []})
  Likes: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
