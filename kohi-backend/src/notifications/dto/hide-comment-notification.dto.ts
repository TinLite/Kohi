import { NotificationDto } from './notification.dto';

export class HideCommentNotificationDto extends NotificationDto {
  userId;
  type: 'HIDE_COMMENT' = 'HIDE_COMMENT';
  comment;
  otherUser;
  constructor(partial: Partial<HideCommentNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
