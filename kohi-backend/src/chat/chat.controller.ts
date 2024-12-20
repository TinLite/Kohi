import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
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
        await this.chatService.createMessage(channel._id, currentUser, createChatDto.firstMessage);
        return channel;
    }

    @Get('/channels/:channelId/messages')
    async getMessages(@Param('channelId') channelId: string, @Query('skip') skip: number = 0, @Query('limit') limit: number = 20) {
        return this.chatService.getMessagesByChannelId(channelId, skip, limit);
    }

    @Post('/channels/:channelId/messages/create')
    async createMessage(@Param('channelId') channelId: string, @Body() {content}: CreateChatMessageDto, @Req() req) {
        if (!content.trim())
            throw new BadRequestException("Message is required");
        const message = await this.chatService.createMessage(channelId, req.user._id, content);
        this.chatService.getChannelById(channelId).then(channel => {
            channel.participants.map(participant => {
                if (participant.user != req.user._id) {
                    this.eventsService.announceToUser(participant.user.toString(), 'chat:message:new', message);
                }
            })
        });
        return message;
    }
}
