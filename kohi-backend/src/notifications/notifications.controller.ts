import { Body, Controller, Post, Query, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { request } from 'http';
import { NotificationsGateway } from './notifications.gateway';
import { EventsService } from '../events/events.service';
import { Notification } from './schemas/notification.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventsService: EventsService,
  ) {}
  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() request,
  ) {
    const userId = request.user._id;
    const savedNotification =
      await this.notificationsService.createNotification(
        createNotificationDto,
        userId,
      );
  
    if(savedNotification) {
      this.eventsService.sendFollowNotification(savedNotification);
    }
    console.log(savedNotification)
    return savedNotification;
  }
}
