import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatChannelSchema } from './schemas/chat-channel.schema';
import { ChatMessageSchema } from './schemas/chat-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatChannel', schema: ChatChannelSchema }]),
    MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule { }
