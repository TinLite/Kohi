import mongoose from 'mongoose';
export class NotificationDto {
  userId: mongoose.Types.ObjectId;
  type: string;

    constructor(partial: Partial<NotificationDto>) {
        Object.assign(this, partial);
    }
}
