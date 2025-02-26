import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query
} from '@nestjs/common';
import mongoose from 'mongoose';
import { User } from 'src/auth/user.decorator';
import { EventsService } from 'src/events/events.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { NewFollowerNotificationDto } from '../notifications/dto/new-follower-notification.dto';

@Controller('users/follows')
export class FollowsController {

  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly eventsService: EventsService,
  ) { }

  @Post('add/:id')
  async followByUser(@Param('id') followUserId: string, @User() req) {
    const author = req._id;
    const userToFollow = await this.usersService.findOne(followUserId);
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }
    const authorUser = await this.usersService.findOne(author);
    if (!authorUser) {
      throw new NotFoundException('Author user not found');
    }
    if (author === followUserId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    if (authorUser.following.includes(followUserId)) {
      throw new BadRequestException('User already followed');
    }
    const test = await this.notificationsService.createNotification(
      new NewFollowerNotificationDto({
        userId: new mongoose.Types.ObjectId(followUserId),
        otherUser: author,
      }),
    );
    return this.usersService.addFollowing(author, followUserId);
  }

  @Delete('unfollow/:id')
  async unFollowByUser(@Param('id') followUserId: string, @User() req) {
    const author = req._id;
    const userToFollow = await this.usersService.findOne(followUserId);
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }
    const authorUser = await this.usersService.findOne(author);
    if (!authorUser.following.includes(followUserId)) {
      throw new NotFoundException('User not followed');
    }
    const notification =
      await this.notificationsService.findOneFollowNotification(
        followUserId,
        author,
      );
    // console.log(notification);
    if (notification) {
      this.notificationsService.remove(notification._id.toString());
    }
    return this.usersService.removeFollowing(author, followUserId);
  }

  @Get('list/followers')
  async getFollowers(
    @User() req,
    @Query() { id }: { id?: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = id ?? req._id;
    const currentPage = page ? Number(page) : 1;
    const skipValue = (currentPage - 1) * Number(limit);
    const currentLimit = limit ? Number(limit) : 10;
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new BadRequestException('Page number or limit number are invalid');
    }
    return this.usersService.getFollowers(userId, skipValue, currentLimit);
  }

  @Get('list/followers/count')
  async getFollowerCount(
    @User() req,
  ) {
    const userId = req._id;
    return this.usersService.getFollowerCount(userId);
  }

  @Get('list/following/count')
  async getFollowingCount(
    @User() req,
  ) {
    const userId = req._id;
    return this.usersService.getFollowingCount(userId);
  }

  @Get('list/count')
  async getTotalCount(
    @User() req,
  ) {
    return {
      followerCount: await this.getFollowerCount(req),
      followingCount: await this.getFollowingCount(req),
    }
  }
  @Get('list/following')
  async getFollowing(
    @User() req,
    @Query() { id }: { id?: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = id ?? req._id;
    const currentPage = page ? Number(page) : 1;
    const skipValue = (currentPage - 1) * Number(limit);
    const currentLimit = limit ? Number(limit) : 10;
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new BadRequestException('Page number or limit number are invalid');
    }
    return await this.usersService.getFollowingIds(
      userId,
      skipValue,
      currentLimit,
    );
  }

  @Get('following')
  async getFollowingByUser(
    @User() req,
    @Query() { id }: { id?: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = id ?? req._id;
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    const userFollowing = await this.usersService.getFollowingIds(userId);
    const totalUser = userFollowing.following.length;
    const totalPage = Math.ceil(totalUser / currentLimit);
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new BadRequestException('Page number or limit number are invalid');
    }
    const followElements = userFollowing.following.slice((currentPage - 1) * currentLimit, currentLimit);
    return {
      data: followElements,
      pagination: {
        currentPage: currentPage,
        totalPage: totalPage,
        totalElement: totalUser,
        limit: currentLimit,
      },
    };
  }
}
