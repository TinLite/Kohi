import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly NotificationModel: Model<Notification>,
  ) {}
  async createNotification(
    createNotificationDto: CreateNotificationDto,
    userId: string,
  ) {
    const { content } = createNotificationDto;
    // console.log(content);
    const notification = new this.NotificationModel({
      content,
      userId,
      isRead: false,
      createAt: new Date(),
    });
    return await notification.save();
  }

  async findAllByUserId(userId: string) {
    return await this.NotificationModel.find({ userId }).exec();
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
