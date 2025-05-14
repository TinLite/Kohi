import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Ban {
  @Prop({ required: true, ref: 'User',type: mongoose.Schema.Types.ObjectId })
  userId: User;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ required: true })
  types: string;
  @Prop({ required: true, default: 'ban' })
  reason: string;
  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ required: true })
  expiresAt?: Date;
  @Prop({ required: true, ref: 'User',type: mongoose.Schema.Types.ObjectId })
  banBy: User;
  @Prop()
  unbanReason?: string;
  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  unbanBy?: User;
}
export const BanSchema = SchemaFactory.createForClass(Ban);
