import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';


@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

 @Prop()
  email: string;

  @Prop({default:"User" })
  roles:String[];

  @Prop({default: Date.now})
  createdAt: Date;

  @Prop({default: Date.now})
  updatedAt: Date;

  @Prop({default:"Null" })
  avatar: string;

  @Prop({default:"Null" })
  wall: string;

  @Prop()
  following: String[];
  
  @Prop()
  bookmarks: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
