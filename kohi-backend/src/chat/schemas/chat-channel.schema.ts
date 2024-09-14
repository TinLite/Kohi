import { Schema, SchemaFactory } from "@nestjs/mongoose";
import e from "express";

enum ChatChannelType {
    PRIVATE = 'private',
    GROUP = 'group'
}

export class ChatChannelParticipant {
    userId: string;
    role: string;
    joinedAt: Date;
}

@Schema()
export class ChatChannel {
    name?: string;
    type: ChatChannelType;
    participants: ChatChannelParticipant[];
}

export const ChatChannelSchema = SchemaFactory.createForClass(ChatChannel);