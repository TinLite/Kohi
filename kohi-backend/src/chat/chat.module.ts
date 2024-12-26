import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EventsModule } from 'src/events/events.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatChannelSchema } from './schemas/chat-channel.schema';
import { ChatMessageSchema } from './schemas/chat-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChatChannel', schema: ChatChannelSchema }]),
    MongooseModule.forFeature([{ name: 'ChatMessage', schema: ChatMessageSchema }]),
    AuthModule,
    EventsModule,
    CloudinaryModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule { }
