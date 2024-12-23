import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { ChatService } from './chat.service';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatParticipantRole } from './schemas/chat-channel.schema';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly eventsService: EventsService,
    ) { }

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
        await this.chatService.createMessage(channel._id, currentUser, {content: createChatDto.firstMessage});
        return channel;
    }

    @Get('/channels/:channelId')
    async getChannel(@Param('channelId') channelId: string) {
        return (await this.chatService.getChannelById(channelId)).populate('participants.user');
    }

    @Get('/channels/:channelId/messages')
    async getMessages(@Param('channelId') channelId: string, @Query('skip') skip: number = 0, @Query('limit') limit: number = 20) {
        return this.chatService.getMessagesByChannelId(channelId, skip, limit);
    }

    @Post('/channels/:channelId/messages/create')
    async createMessage(@Param('channelId') channelId: string, @Body() messageDto: CreateChatMessageDto, @Req() req) {
        const message = await this.chatService.createMessage(channelId, req.user._id, messageDto);
        this.chatService.getChannelById(channelId).then(channel => {
            channel.participants.map(participant => {
                this.eventsService.announceToUser(participant.user.toString(), 'chat:message:new', message);
            })
        });
        return message;
    }
    
    @Delete('/channels/:channelId/messages/:messageId')
    async recallMessage(@Param('channelId') channelId: string, @Param('messageId') messageId: string, @Req() req) {
        const message = (await this.chatService.getMessageById(messageId)).depopulate('senderID');
        if (message.senderID.toString()! !== req.user._id) {
            throw new BadRequestException('You are not allowed to remove this message');
        }
        return this.chatService.recallMessage(messageId);
    }
}
