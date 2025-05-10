import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/user.decorator';
import { CallsService } from 'src/calls/calls.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EventsService } from 'src/events/events.service';
import { ChatService } from './chat.service';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { ChatParticipantRole } from './schemas/chat-channel.schema';

@Controller('chat')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);
    constructor(
        private readonly chatService: ChatService,
        private readonly eventsService: EventsService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly callsService: CallsService,
    ) { }

    @Get('/channels')
    async getChannels(@User() req, @Query('participants') participants?: string) {
        const arr = [req._id];
        if (participants) {
            arr.push(...participants.split(','));
        }
        const result = await this.chatService.getChannelsByParticipants(arr);
        const channelIds = result.map(channel => channel._id.toHexString())
        const latestMessages = await this.chatService.getLatestMessagesByChannelIds(channelIds)
        return result.map(channel => {
            // @ts-expect-error
            const latestMessage = latestMessages.find(message => message.channelID.toHexString() === channel._id.toHexString());
            return {
                ...channel.toJSON(),
                latestMessage
            }
        });
    }

    @Post('/channels/create')
    async createChannel(@Body() createChatDto: CreateChatChannelDto, @User() req) {
        const currentUser = req._id;
        let isCurrentUserExisted = false;
        createChatDto.participants = createChatDto.participants.map(participant => {
            let part = {
                user: participant.toString(),
                role: ChatParticipantRole.PARTICIPANT,
                joinedAt: new Date()
            }
            if (part.user == currentUser) {
                part["role"] = ChatParticipantRole.ADMIN;
                isCurrentUserExisted = true;
            }
            return part;
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
        const latestMessage = await this.chatService.createMessage(channel._id, currentUser, { content: createChatDto.firstMessage });
        console.log(latestMessage);
        return {
            channel: channel,
            latestMessage
        };
    }

    @Get('/channels/:channelId')
    async getChannel(@Param('channelId') channelId: string) {
        return (await this.chatService.getChannelById(channelId)).populate('participants.user');
    }

    @Patch('/channels/:channelId/')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateChannel(@Param('channelId') channelId: string, @Body() updateDto: UpdateChatChannelDto,
    ) {
        return this.chatService.updateChannel(channelId, updateDto);
    }

    @Get('/channels/:channelId/messages')
    async getMessages(@Param('channelId') channelId: string, @Query('skip') skip: number = 0, @Query('limit') limit: number = 20) {
        return this.chatService.getMessagesByChannelId(channelId, skip, limit);
    }

    @Post('/channels/:channelId/messages/create')
    async createMessage(@Param('channelId') channelId: string, @Body() messageDto: CreateChatMessageDto, @User() req) {
        const message = await this.chatService.createMessage(channelId, req._id, messageDto);
        this.chatService.getChannelById(channelId).then(channel => {
            channel.participants.map(participant => {
                this.eventsService.announceToUser(participant.user.toString(), 'chat:message:new', message);
            })
        });
        return message;
    }

    @Delete('/channels/:channelId/messages/:messageId')
    async recallMessage(@Param('channelId') channelId: string, @Param('messageId') messageId: string, @User() req) {
        const message = (await this.chatService.getMessageById(messageId)).depopulate('senderID');
        if (message.senderID.toString()! !== req._id) {
            throw new BadRequestException('You are not allowed to remove this message');
        }
        this.chatService.recallMessage(messageId).then((newMessage) => {
            this.chatService.getChannelById(channelId).then(channel => {
                channel.participants.map(participant => {
                    this.eventsService.announceToUser(participant.user.toString(), 'chat:message:update', newMessage);
                })
            });
        });
    }

    @Post('/channels/:channelId/calls/join')
    async createCallSession(@Param('channelId') channelId: string, @User() user, @Body() body) {
        const channel = await this.chatService.getChannelById(channelId);
        if (!channel) {
            throw new BadRequestException('Channel not found');
        }
        if (user._id.toString()! !== channel.participants.find(participant => participant.user.toString() === user._id).user.toString()) {
            throw new BadRequestException('You are not allowed to join this call');
        }
        this.logger.debug(`User ${user._id} joined call session ${channelId}`);
        this.logger.debug(`Body: ${JSON.stringify(body)}`);
        return {status: "OK"};
        // const sessionId = await this.callsService.getCallSessionByChannelId(channelId);
        // if (!sessionId) {
        //     const newSessionId = await this.callsService.createCallSession(channelId);
        //     this.eventsService.announceToUser(user._id, 'call:session:new', newSessionId);
        //     return newSessionId;
        // }
    }


}
