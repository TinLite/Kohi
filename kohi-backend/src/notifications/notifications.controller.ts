import { Body, Controller, Post, Req } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

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
