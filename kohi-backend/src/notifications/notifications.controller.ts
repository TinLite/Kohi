import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { NotificationsService } from './notifications.service';
import mongoose from 'mongoose';
import { User } from 'src/auth/user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventsService: EventsService,
  ) {}
  @Get('all')
  async getAllNotifications(@User() req) {
    return await this.notificationsService.findAllNotificationByUserId(
      req.user._id,
    );
  }

  @Delete('delete/:id')
  async deleteNotification(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.notificationsService.deleteNotification(id);
  }
  @Get('all/unread')
  async getAllUnreadNotifications(@User() req) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    return await this.notificationsService.findAllNotificationNotReadByUserId(
      req.user._id,
    );
  }
  @Post('read/:id')
  async readNotification(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @User() req,
  ) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    const noti = await this.notificationsService.findOneNotification(id);
    if (noti.userId.toString() !== req.user._id) {
      throw new ForbiddenException(
        'You are not allowed to read this notification',
      );
    }
    if (!noti) {
      throw new NotFoundException('Notification not found');
    }
    if (noti.isRead === true) {
      throw new BadRequestException('Notification already read');
    }
    return await this.notificationsService.readNotification(id);
  }
  @Delete('delete/:id')
  async deleteOneNotification(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @User() req,
  ) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    const noti = await this.notificationsService.findOneNotification(id);
    if (noti.userId.toString() !== req.user._id) {
      throw new ForbiddenException(
        'You are not allowed to delete this notification',
      );
    }
    if (!noti) {
      throw new NotFoundException('Notification not found');
    }
    return await this.notificationsService.deleteNotification(id);
  }
}
