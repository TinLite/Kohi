import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { ChatParticipantRole } from './schemas/chat-channel.schema';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
    
    @Get('/channels')
    async getChannels(@Req() req) {
        return this.chatService.getChannelsByUserId(req.user._id);
    }

    @Post('/channels/create')
    async createChannel(@Body() createChatDto: CreateChatChannelDto, @Req() req) {
        const currentUser = req.user._id;
        let isCurrentUserExisted = false;
        createChatDto.participants.map(participant => {
            if (participant.user === currentUser) {
                participant.role = ChatParticipantRole.ADMIN;
                isCurrentUserExisted = true;
            } else {
                participant.role = ChatParticipantRole.PARTICIPANT;
            }
            participant.joinedAt = new Date();
        });
        if (!isCurrentUserExisted) {
            createChatDto.participants.push({
                user: currentUser,
                role: ChatParticipantRole.ADMIN,
                joinedAt: new Date()
            });
        }
        if (createChatDto.participants.length < 2) {
            throw new BadRequestException('Channel must have at least 2 participants');
        }
        const channel = await this.chatService.createChannel(createChatDto);
        await this.chatService.createMessage(channel._id, currentUser, createChatDto.firstMessage);
        return channel;
    }

    @Get('/channels/:channelId/messages')
    async getMessages(@Req() req) {
        return this.chatService.getMessagesByChannelId(req.params.channelId);
    }
}
