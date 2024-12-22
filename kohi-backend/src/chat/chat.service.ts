import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatChannel } from './schemas/chat-channel.schema';
import { ChatMessage } from './schemas/chat-message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('ChatChannel') private chatChannelModel: Model<ChatChannel>,
    @InjectModel('ChatMessage') private chatMessageModel: Model<ChatMessage>,
  ) { }
  getChannelsByUserId(userId: string) {
    return this.chatChannelModel.find({ "participants.user": userId }).populate('participants.user');
  }

  async getChannelById(channelId: string) {
    return this.chatChannelModel.findById(channelId);
  }

  async createChannel(createChatDto: CreateChatChannelDto) {
    const newChannel = new this.chatChannelModel({
      name: createChatDto.name,
      participants: createChatDto.participants,
    });
    return newChannel.save();
  }

  async createMessage(channelId: ChatChannel | mongoose.Types.ObjectId | String, senderId: User | mongoose.Types.ObjectId | String, createChatChannelDto: CreateChatMessageDto) {
    const newMessage = new this.chatMessageModel({
      channelID: channelId,
      senderID: senderId,
      ...createChatChannelDto,
    });
    return (await(await newMessage.save()).populate({
      path: 'senderID',
      select: 'username avatar displayName',
    })).populate("replyTo", "content senderID isRecalled");
  }

  async getMessagesByChannelId(channelId: string, skip: number = 0, limit: number = 10) {
    return this.chatMessageModel.find({ channelID: channelId }).sort({ timeStamp: -1 }).skip(skip).limit(limit).populate({
      path: 'senderID',
      select: 'username avatar displayName',
    }).populate("replyTo", "content senderID isRecalled");
  }
}
