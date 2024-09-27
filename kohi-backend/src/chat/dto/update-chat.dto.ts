import { PartialType } from '@nestjs/mapped-types';
import { CreateChatChannelDto } from './create-chat-channel.dto';

export class UpdateChatDto extends PartialType(CreateChatChannelDto) {
  id: number;
}
