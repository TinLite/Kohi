import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationFlags } from './schemas/notification.schema';
import { NewFollowerNotificationDto } from './dto/new-follower-notification.dto';
import { EventsService } from 'src/events/events.service';
import { NewPostNotificationDto } from './dto/new-post-notification.dto';
import { LikePostNotificationDto } from './dto/new-likepost-notification.dto';
import { NewCommentNotificationDto } from './dto/new-comment-notification.dto';
import { LIKECommentNotificationDto } from './dto/new-likecomment-notification.dto';
import { NewReplyCommentNotificationDto } from './dto/new-reply-comment-notification.dto';
import path from 'path';
import { HideCommentNotificationDto } from './dto/hide-comment-notification.dto';
import { HidePostNotificationDto } from './dto/hide-post-notification.dto';
import { RejectPostNotificationDto } from './dto/reject-report-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,

    private readonly eventsService: EventsService,
  ) {}
  async createNotification(notificationDto: NewFollowerNotificationDto) {
    const notification = await this.notificationModel.create(notificationDto);
    await (
      await notification.populate('userId', 'username avatar displayName')
    ).populate('otherUser', 'username avatar displayName');
    delete notification.__v;
    this.eventsService.announceToUser(
      notificationDto.userId,
      'notification:follow:newfollow',
      notification,
    );
    console.log(notification);
  }
  async createNotificationNewPost(notification: NewPostNotificationDto) {
    const notificationPost = await this.notificationModel.create(notification);
    await await (
      await (
        await notificationPost.populate('userId', 'username avatar displayName')
      ).populate('otherUser', 'username avatar displayName')
    ).populate({
      path: 'post',
      select: 'title content author',
      populate: {
        path: 'author',
        select: 'username avatar displayName',
      },
    });
    delete notificationPost.__v;
    this.eventsService.announceToUser(
      notification.userId._id,
      'notification:post:newpost',
      notificationPost,
    );
    console.log('Notification sent to user ' + notification.userId);
  }
  async createNotificationNewLikePost(notification: LikePostNotificationDto) {
    const notificationLikePost =
      await this.notificationModel.create(notification);
    await await (
      await (
        await notificationLikePost.populate(
          'userId',
          'username avatar displayName',
        )
      ).populate('otherUser', 'username avatar displayName')
    ).populate({
      path: 'post',
      select: 'title content author',
      populate: {
        path: 'author',
        select: 'username avatar displayName',
      },
    });
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
    await await (
      await (
        await notificationComment.populate(
          'userId',
          'username avatar displayName',
        )
      ).populate('otherUser', 'username avatar displayName')
    ).populate({
      path: 'post',
      select: 'title content author',
      populate: {
        path: 'author',
        select: 'username avatar displayName',
      },
    });

    delete notificationComment.__v;
    this.eventsService.announceToUser(
      notification.userId._id,
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
    (
      await (
        await notificationLikeComment.populate(
          'userId',
          'username avatar displayName',
        )
      ).populate('otherUser', 'username avatar displayName')
    ).populate({
      path: 'post',
      select: 'title content author',
      populate: {
        path: 'author',
        select: 'username avatar displayName',
      },
    });
    delete notificationLikeComment.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:comment:likecomment',
      notificationLikeComment,
    );
    console.log('Notification sent to user ' + notification.userId);
  }

  async createNotificationReplyComment(
    notification: NewReplyCommentNotificationDto,
  ) {
    const notificationReplyComment =
      await this.notificationModel.create(notification);
    await (
      await (
        await notificationReplyComment.populate(
          'userId',
          'username avatar displayName',
        )
      ).populate('otherUser', 'username avatar displayName')
    ).populate({
      path: 'post',
      select: 'title content author',
      populate: {
        path: 'author',
        select: 'username avatar displayName',
      },
    });
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
        flags: { $nin: [NotificationFlags.HIDDEN] },
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
        flags: { $nin: [NotificationFlags.HIDDEN] },
      })
      .sort({ createAt: -1 })
      .populate('otherUser')
      .exec();
  }
  async deleteNotification(id) {
    return await this.notificationModel.findByIdAndDelete({ _id: id }).exec();
  }
  async remove(id: string) {
    return this.notificationModel.findOneAndUpdate(
      {
        _id: id,
        flags: { $nin: [NotificationFlags.HIDDEN] },
      },
      { $push: { flags: NotificationFlags.HIDDEN } },
    );
  }

  async findOneLikePostNotification(id, postId) {
    return await this.notificationModel
      .findOne({
        userId: id,
        post: postId,
        type: 'LIKE_POST',
      })
      .exec();
  }

  async findOneLikeCommentNotification(id, commentId) {
    return await this.notificationModel
      .findOne({
        otherUser: id,
        comment: commentId,
        type: 'LIKE_COMMENT',
      })
      .exec();
  }

  async findOneFollowNotification(id, otherUser) {
    return this.notificationModel
      .findOne({
        userId: id,
        otherUser: otherUser,
        type: 'NEW_FOLLOWER',
      })
      .exec();
  }
  async findOneCommentNotification(commentId) {
    return this.notificationModel
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
  async deleteAllNotificationByPostId(postId) {
    return this.notificationModel.findOneAndUpdate(
      {
        post: postId,
        flags: { $nin: [NotificationFlags.HIDDEN] },
      },
      { $push: { flags: NotificationFlags.HIDDEN } },
    );
  }
  //đánh dấu đã đọc tất cả thông báo của người dùng
  async readAllNotificationByUserId(userId: string) {
    return await this.notificationModel
      .updateMany(
        {
          userId: userId,
          isRead: false,
          flags: { $nin: [NotificationFlags.HIDDEN] },
        },
        { $set: { isRead: true } },
      )
      .exec();
  }
  async deleteAllNotificationByUserId(userId: string) {
    return await this.notificationModel
      .deleteMany({
        userId: userId,
      })
      .exec();
  }

  // tạo thông báo hide comment đến chủ comment
  async createNotificationHideComment(
    notification: HideCommentNotificationDto,
  ) {
    const notificationHideComment =
      await this.notificationModel.create(notification);
    await await (
      await notificationHideComment.populate(
        'userId',
        'username avatar displayName',
      )
    ).populate('otherUser', 'username avatar displayName');
    delete notificationHideComment.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:comment:hidecomment',
      notificationHideComment,
    );
    console.log('Notification sent to user ' + notification.userId);
    return notificationHideComment;
  }
  // tạo thông báo hide post đến chủ post
  async createNotificationHidePost(notification: HidePostNotificationDto) {
    const notificationHidePost =
      await this.notificationModel.create(notification);
    await await (
      await notificationHidePost.populate(
        'userId',
        'username avatar displayName',
      )
    ).populate('otherUser', 'username avatar displayName');
    delete notificationHidePost.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:post:hidepost',
      notificationHidePost,
    );
    console.log('Notification sent to user ' + notification.userId);
    return notificationHidePost;
  }
  // tạo thông báo reject report đến chủ report
  async createNotificationRejectReport(
    notification: RejectPostNotificationDto,
  ) {
    const notificationRejectReport =
      await this.notificationModel.create(notification);
    await await (
      await notificationRejectReport.populate(
        'userId',
        'username avatar displayName',
      )
    ).populate('otherUser', 'username avatar displayName');
    delete notificationRejectReport.__v;
    this.eventsService.announceToUser(
      notification.userId,
      'notification:report:rejectreport',
      notificationRejectReport,
    );
    console.log('Notification sent to user ' + notification.userId);
    return notificationRejectReport;
  }
  async findOneHideCommentNotification(userId: string, commentId: string) {
    return this.notificationModel
      .findOne({
        userId,
        comment: commentId,
      })
      .exec();
  }
  async findOneHidePostNotification(userId: string, postId: string) {
    return this.notificationModel
      .findOne({
        userId,
        post: postId,
      })
      .exec();
  }
}
