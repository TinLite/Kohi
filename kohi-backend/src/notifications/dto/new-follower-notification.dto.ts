import { mongo } from 'mongoose';
import { NotificationDto } from './notification.dto';

export class NewFollowerNotificationDto extends NotificationDto {
  userId;
  type: 'NEW_FOLLOWER' = 'NEW_FOLLOWER';
  otherUser;

  constructor(partial: Partial<NewFollowerNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
