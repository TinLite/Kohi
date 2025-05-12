import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
export enum ReportFlags {
  HIDDEN = 'hidden',
}
@Schema()
export class Report {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
  @Prop({ enum: ['post', 'comment'], required: true })
  type: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'type' })
  targetId: mongoose.Schema.Types.ObjectId;
  @Prop()
  reason: string;
  @Prop({ default: Date.now })
  timeStamp: Date;
  @Prop()
  flags: ReportFlags[];
}
export const ReportSchema = SchemaFactory.createForClass(Report);
