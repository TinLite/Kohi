import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import e from "express";
import mongoose, { ObjectId } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export enum ChatChannelType {
    PRIVATE = 'private',
    GROUP = 'group'
}

export enum ChatParticipantRole {
    ADMIN = 'admin',
    PARTICIPANT = 'participant'
}

export class ChatChannelParticipant {
    user: ObjectId;
    role: string;
    joinedAt: Date;
}

@Schema()
export class ChatChannel {
    @Prop()
    name?: string;

    @Prop({ default: ChatChannelType.PRIVATE })
    type: ChatChannelType;

    @Prop([
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: String,
            joinedAt: Date
        }
    ])
    participants: ChatChannelParticipant[];
}

export const ChatChannelSchema = SchemaFactory.createForClass(ChatChannel);