import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { NewFollowerNotificationDto } from './dto/new-follower-notification.dto';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly NotificationModel: Model<Notification>,

    private readonly eventsService: EventsService,
  ) {}
  async createNotification(notificationDto: NewFollowerNotificationDto) {
    const notification = await (await this.NotificationModel.create(notificationDto)).populate('userId');
    delete notification.__v;
    this.eventsService.announceToUser(
      notificationDto.userId,
      'notification',
      notification,
    );
    console.log(notification);
  }

  async findAllByUserId(userId: string) {
    return await this.NotificationModel.find({ userId }).exec();
  }
}
