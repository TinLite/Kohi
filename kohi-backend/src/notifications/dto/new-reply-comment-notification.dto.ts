import { mongo } from 'mongoose';
import { NotificationDto } from './notification.dto';

export class NewReplyCommentNotificationDto extends NotificationDto {
  userId;
  type: 'NEW_REPLY_COMMENT' = 'NEW_REPLY_COMMENT';
  otherUser;
  post;
  comment;
  constructor(partial: Partial<NewReplyCommentNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
