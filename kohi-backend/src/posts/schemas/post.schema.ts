import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/users/schemas/user.schema";

export enum PostFlags {
  HIDDEN = 'hidden',
}

@Schema()
export class Post {
  @Prop()
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  author: User;

  @Prop({
    default: Date.now(),
  })
  createdAt: Date;

  @Prop({
    default: Date.now(),
  })
  updatedAt: Date;

  @Prop()
  media: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  likes: User[];

  @Prop()
  flags: PostFlags[];
}
export const PostSchema = SchemaFactory.createForClass(Post);