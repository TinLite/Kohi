import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatChannelSchema } from './schemas/chat-channel.schema';
import { ChatMessageSchema } from './schemas/chat-message.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatChannel', schema: ChatChannelSchema }]),
    MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }]),
    AuthModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule { }
