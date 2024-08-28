import { Prop } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

export class Post {
  @Prop()
  content: string;

  @Prop()
  author: ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  media: string[];

  @Prop()
  likes: ObjectId[];
}