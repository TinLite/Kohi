import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop({
    select: false,
  })
  bio: string;

  @Prop({
    select: false,
  })
  password: string;

  @Prop()
  displayName: string;

  @Prop({
    select: false,
  })
  email: string;

  @Prop({ default: [Role.USER], select: false })
  roles: String[];

  @Prop({ default: Date.now, select: false })
  createdAt: Date;

  @Prop({ default: Date.now, select: false })
  updatedAt: Date;

  @Prop()
  avatar: string;

  @Prop()
  wall: string;

  // Tạo hai trường nhằm tránh Full Database Scan
  @Prop({ ref: 'User' })
  following: String[];

  @Prop({ ref: 'User' })
  followers: String[];

  @Prop([{ type: String, ref: 'Post' }])
  bookmarks: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);
