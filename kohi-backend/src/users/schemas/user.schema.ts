import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Schema as MongooseSchema} from 'mongoose';
@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop({default: Date.now})
  createdAt: Date;

  @Prop({default: Date.now})
  updatedAt: Date;

  @Prop()
  avatar: string;

  @Prop()
  wall: string;

  @Prop()
  following: String[];
  
  @Prop()
  bookmarks: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
