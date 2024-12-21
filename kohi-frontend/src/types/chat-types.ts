import { User } from "./user-type";

export enum ChatParticipantRole {
    ADMIN = "admin",
    PARTICIPANT = "participant"
}

export enum ChatChannelType {
    PRIVATE = "private",
    GROUP = "group"
}

export class ChatParticipant {
    user: User;
    role: ChatParticipantRole;
    joinedAt: Date;
    constructor(
        user: User,
        role: ChatParticipantRole,
        joinedAt: Date
    ) {
        this.user = user;
        this.role = role;
        this.joinedAt = joinedAt;
    }
}

export class ChatChannel {
    _id: string;
    name: string | undefined;
    type: ChatChannelType;
    participants: ChatParticipant[];
    constructor(
        _id: string,
        name: string | undefined,
        type: ChatChannelType,
        participants: ChatParticipant[],
    ) {
        this._id = _id;
        this.name = name;
        this.type = type;
        this.participants = participants;
    }
}

export class ChatMessage {
    _id: string;
    senderID: {
        _id: string;
        displayName?: string;
        username: string;
        avatar?: string;
    };
    replyTo?: ChatMessage;
    channelID: string;
    content: string;
    createdAt: Date;
    constructor(
        _id: string,
        senderID: {
            _id: string;
            displayName?: string;
            username: string;
            avatar?: string;
        },
        replyTo: ChatMessage,
        channelID: string,
        content: string,
        createdAt: Date
    ) {
        this._id = _id;
        this.senderID = senderID;
        this.replyTo = replyTo;
        this.channelID = channelID;
        this.content = content;
        this.createdAt = createdAt;
    }
}