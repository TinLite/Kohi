import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { ChatChannel } from "./chat-channel.schema";

@Schema()
export class ChatMessage {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatChannel',
        index: true,
    })
    channelID: ChatChannel;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatMessage',
    })
    replyTo: mongoose.Schema.Types.ObjectId | ChatMessage;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        select: 'username avatar displayName',
    })
    senderID: User;

    @Prop()
    content: string;

    @Prop({
        default: Date.now,
    })
    timeStamp: Date;

    @Prop()
    isRecalled: boolean;

    @Prop()
    files: string[];

    @Prop({

    })
    type?: 'SYSTEM_MESSAGE';
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);