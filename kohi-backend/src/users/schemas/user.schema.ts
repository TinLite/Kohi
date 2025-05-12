import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  @Prop({ select: false })
  sdt: string;
  @Prop({ default: [Role.USER], select: false })
  roles: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now, select: false })
  updatedAt: Date;

  @Prop()
  avatar: string;

  @Prop()
  wall: string;

  // Tạo hai trường nhằm tránh Full Database Scan
  @Prop({ ref: 'User', index: true })
  following: String[];

  @Prop([{ type: String, ref: 'Post' }])
  bookmarks: Post[];
  @Prop({
    default: false,
  })
  verifyEmail: boolean;
  @Prop()
  googleId: string;
  @Prop()
  discordId: string;
  // @Prop({ default: false, select: false })
  // isBanned: boolean;
  // @Prop({
  //   default: [],
  //   enum: ['post', 'comment', 'account'],
  //   type: [String],
  //   select: false,
  // })
  // banActions: string[];
  // @Prop({ type: Date, select: false })
  // banExpiresAt?: Date;
  // @Prop({ type: Date })
  // postBanExpiresAt?: Date;
  // @Prop({ type: Date })
  // commentBanExpiresAt?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
