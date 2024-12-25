import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { NewFollowerNotificationDto } from './dto/new-follower-notification.dto';
import { EventsService } from 'src/events/events.service';
import { NewPostNotificationDto } from './dto/new-post-notification.dto';
import { LikePostNotificationDto } from './dto/new-likepost-notification.dto';
import { NewCommentNotificationDto } from './dto/new-comment-notification.dto';
import { LIKECommentNotificationDto } from './dto/new-likecomment-notification.dto';
import { NewReplyCommentNotificationDto } from './dto/new-reply-comment-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,

    private readonly eventsService: EventsService,
  ) {}
  async createNotification(notificationDto: NewFollowerNotificationDto) {
    const notification = await (
      await this.notificationModel.create(notificationDto)
    ).populate('userId');
    delete notification.__v;
    this.eventsService.announceToUser(
      notificationDto.userId,
      'notification:follow:newfollow',
      notification,
    );
    console.log(notification);
  }
  async createNotificationNewPost(notification: NewPostNotificationDto) {
    const notificationPost =
      await await this.notificationModel.create(notification);
    delete notificationPost.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:post:newpost',
      notificationPost,
    );
    console.log('Notification sent to user ' + notification.userId);
  }
  async createNotificationNewLikePost(notification: LikePostNotificationDto) {
    const notificationLikePost =
      await await this.notificationModel.create(notification);
    delete notificationLikePost.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:post:likepost',
      notificationLikePost,
    );
    console.log('Notification sent to user ' + notification.userId);
  }

  async createNotificationNewComment(notification: NewCommentNotificationDto) {
    const notificationComment =
      await this.notificationModel.create(notification);
    console.log(notificationComment, notification);
    delete notificationComment.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:comment:newcomment',
      notificationComment,
    );
    console.log('Notification sent to user ' + notification.userId);
  }

  async createNotificationLikeComment(
    notification: LIKECommentNotificationDto,
  ) {
    const notificationLikeComment =
      await this.notificationModel.create(notification);
    delete notificationLikeComment.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:comment:likecomment',
      notificationLikeComment,
    );
    console.log('Notification sent to user ' + notification.userId);
  }
  async createNotificationReplyComment(notification:NewReplyCommentNotificationDto){
    const notificationReplyComment = await this.notificationModel.create(notification);
    delete notificationReplyComment.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:comment:replycomment',
      notificationReplyComment,
    );
    console.log('Notification sent to user ' + notification.userId);
  }
  async findAllNotificationByUserId(id) {
    return await this.notificationModel
      .find({
        userId: id,
      })
      .sort({ createAt: -1 })
      .populate('otherUser')
      .exec();
  }
  async findAllNotificationNotReadByUserId(id) {
    return await this.notificationModel
      .find({
        userId: id,
        isRead: false,
      })
      .sort({ createAt: -1 })
      .populate('otherUser')
      .exec();
  }
  async deleteNotification(id) {
    return await this.notificationModel.findByIdAndDelete(id).exec();
  }
  async findOneLikePostNotification(id, postId) {
    return await this.notificationModel
      .findOne({
        userId: id,
        post: postId,
      })
      .exec();
  }

  async findOneLikeCommentNotification(id, commentId) {
    return await this.notificationModel
      .findOne({
        userId: id,
        comment: commentId,
      })
      .exec();
  }

  async findOneFollowNotification(id, otherUser) {
    return await this.notificationModel
      .findOne({
        userId: id,
        otherUser: otherUser,
      })
      .exec();
  }
  async findOneCommentNotification(commentId) {
    return await this.notificationModel
      .findOne({
        comment: commentId,
      })
      .exec();
  }
  async findAllByUserId(userId: string) {
    return await this.notificationModel.find({ userId }).exec();
  }

  async readNotification(id) {
    return await this.notificationModel
      .findOneAndUpdate({ _id: id }, { isRead: true })
      .exec();
  }
  async findOneNotification(id) {
    return await this.notificationModel.findOne({ _id: id }).exec();
  }
  async deleteOneNotification(id) {
    return await this.notificationModel.findByIdAndDelete(id).exec();
  }
}
