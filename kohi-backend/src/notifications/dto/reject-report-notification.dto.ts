import { NotificationDto } from './notification.dto';

export class RejectPostNotificationDto extends NotificationDto {
  userId;
  type: 'REJECT_REPORT' = 'REJECT_REPORT';
  constructor(partial: Partial<RejectPostNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
