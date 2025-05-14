import { NotificationDto } from './notification.dto';

export class HidePostNotificationDto extends NotificationDto {
  userId;
  type: 'HIDE_POST' = 'HIDE_POST';
  post;
  otherUser;
  constructor(partial: Partial<HidePostNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
