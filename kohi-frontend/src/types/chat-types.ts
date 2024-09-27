export enum ChatParticipantRole {
    ADMIN = "admin",
    PARTICIPANT = "participant"
}

export enum ChatChannelType {
    PRIVATE = "private",
    GROUP = "group"
}

export class ChatParticipant {
    userId: string;
    role: ChatParticipantRole;
    joinedAt: Date;
    constructor(
        userId: string,
        role: ChatParticipantRole,
        joinedAt: Date
    ) {
        this.userId = userId;
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