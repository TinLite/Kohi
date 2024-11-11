import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatChannelSchema } from './schemas/chat-channel.schema';
import { ChatMessageSchema } from './schemas/chat-message.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { EventsGateway } from 'src/events/events.gateway';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatChannel', schema: ChatChannelSchema }]),
    MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }]),
    AuthModule,
    EventsModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule { }
