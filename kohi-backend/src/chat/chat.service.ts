import { Injectable } from '@nestjs/common';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ChatChannel } from './schemas/chat-channel.schema';
import { ChatMessage } from './schemas/chat-message.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('ChatChannel') private chatChannelModel: Model<ChatChannel>,
    @InjectModel('ChatMessage') private chatMessageModel: Model<ChatMessage>,
  ) {}
  getChannelsByUserId(userId: string) {
    return this.chatChannelModel.find({ "participants.user": userId }).populate('participants.user');
  }

  getChannelById(channelId: string) {
    this.chatChannelModel.findById(channelId);
  }

  async createChannel(createChatDto: CreateChatChannelDto) {
    const newChannel = new this.chatChannelModel({
      name: createChatDto.name,
      participants: createChatDto.participants,
    });
    return newChannel.save();
  }

  createMessage(channelId: ChatChannel | mongoose.Types.ObjectId | String, senderId: User | mongoose.Types.ObjectId | String, content: string) {
    const newMessage = new this.chatMessageModel({
      channelID: channelId,
      senderID: senderId,
      content: content,
    });
    return newMessage.save();
  }

  async getMessagesByChannelId(channelId: string) {
    return this.chatMessageModel.find({ channelID: channelId }).populate('senderID');
  }
}
