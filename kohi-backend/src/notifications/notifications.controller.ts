import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { NotificationsService } from './notifications.service';
import mongoose from 'mongoose';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventsService: EventsService,
  ) {}
  @Get('all')
  async getAllNotifications(@Req() req) {
    return await this.notificationsService.findAllNotificationByUserId(req.user._id);
  }

  @Delete('delete/:id')
  async deleteNotification(@Param('id') id:mongoose.Schema.Types.ObjectId) {
    return await this.notificationsService.deleteNotification(id);
  }

  
}
