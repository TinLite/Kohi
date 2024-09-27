import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ChatChannelParticipant } from "../schemas/chat-channel.schema";

export class CreateChatChannelDto {
    
    @IsArray()
    participants: ChatChannelParticipant[];

    @IsOptional()
    name: string;

    @IsNotEmpty()
    @IsString()
    firstMessage: string;
}
