import { mongo } from 'mongoose';
import { NotificationDto } from './notification.dto';

export class LIKECommentNotificationDto extends NotificationDto {
  userId;
  type: 'LIKE_COMMENT' = 'LIKE_COMMENT';
  otherUser;
  post;
  comment;
  constructor(partial: Partial<LIKECommentNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
