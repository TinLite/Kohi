import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/users/schemas/user.schema";

@Schema()
export class Notification {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: User // người nhận đc thông báo
    @Prop()
    content: string
    @Prop({default:false})
    isRead:boolean
    @Prop({default:Date.now()})
    createAt:Date
}
export const NotificationSchema = SchemaFactory.createForClass(Notification)