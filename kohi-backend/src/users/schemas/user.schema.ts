import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop({ default: [Role.USER] })
  roles: String[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  avatar: string;

  @Prop()
  wall: string;

  // Tạo hai trường nhằm tránh Full Database Scan
  @Prop()
  following: String[];

  @Prop()
  followers: String[];

  @Prop()
  bookmarks: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
