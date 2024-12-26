import { PartialType } from '@nestjs/mapped-types';
import { CreateChatChannelDto } from './create-chat-channel.dto';

export class UpdateChatChannelDto extends PartialType(CreateChatChannelDto) {
  
}
