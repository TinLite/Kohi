import { mongo } from 'mongoose';
import { NotificationDto } from './notification.dto';

export class NewCommentNotificationDto extends NotificationDto {
  userId;
  type: 'NEW_COMMENT' = 'NEW_COMMENT';
  otherUser;
  post;
  comment;
  constructor(partial: Partial<NewCommentNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
