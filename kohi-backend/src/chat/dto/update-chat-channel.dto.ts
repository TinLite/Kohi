import { IsString } from 'class-validator';

export class UpdateChatChannelDto {
    @IsString()
    name: string;

    // avatar: string;
}
