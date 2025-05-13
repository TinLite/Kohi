import { IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateChatMessageDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsMongoId()
    replyTo?: string;
    
    files?: string[];
}
