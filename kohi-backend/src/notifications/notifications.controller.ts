import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventsService: EventsService,
  ) {}
  @Get('all')
  async getAllNotifications() {
    // return await this.notificationsService.getAllNotifications();
  }
}
