import { mongo } from 'mongoose';
import { NotificationDto } from './notification.dto';

export class NewPostNotificationDto extends NotificationDto {
  userId;
  type: 'REPORT_POST' = 'REPORT_POST';
  post;
  constructor(partial: Partial<NewPostNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
