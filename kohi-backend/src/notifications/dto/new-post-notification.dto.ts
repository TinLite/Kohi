import { mongo } from 'mongoose';
import { NotificationDto } from './notification.dto';

export class NewPostNotificationDto extends NotificationDto {
  userId;
  type: 'NEW_POST' = 'NEW_POST';
  otherUser;
  post;
  constructor(partial: Partial<NewPostNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
