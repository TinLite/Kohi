import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateChatMessageDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsMongoId()
    replyTo?: string;
}
