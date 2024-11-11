import { mongo } from 'mongoose';
import { NotificationDto } from './notification.dto';

export class LikePostNotificationDto extends NotificationDto {
  userId;
  type: 'LIKE_POST' = 'LIKE_POST';
  otherUser;
  post;
  constructor(partial: Partial<LikePostNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
