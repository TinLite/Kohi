import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ChatChannel } from "./chat-channel.schema";
import { User } from "src/users/schemas/user.schema";

@Schema()
export class ChatMessage {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatChannel'
    })
    channelID: ChatChannel;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    senderID: User;

    @Prop()
    content: string;

    @Prop({
        default: Date.now(),
    })
    timeStamp: Date;

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    })
    readBy: User[];
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);