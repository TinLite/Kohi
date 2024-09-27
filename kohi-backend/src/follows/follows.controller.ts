import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException, Query } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller('users/follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}
  @Post('add/:id')
  async followByUser(@Param('id') followUserId: string, @Req() req) {
    const author = req.user._id;
    const userToFollow = await this.usersService.findOne(followUserId);
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }
    const authorUser = await this.usersService.findOne(author);
    if (!authorUser) {
      throw new NotFoundException('Author user not found');
    }
    if (authorUser.following.includes(followUserId)) {
      throw new NotFoundException('User already followed');
    }
    await this.followsService.followByUser(author, followUserId);

    const content = `User ${authorUser.displayName || authorUser.username} is now following you.`;
    const test = await this.notificationsService.createNotification(
      { content },
      followUserId,
    );
    // console.log(test);
  }

  @Delete('unfollow/:id')
  async unFollowByUser(@Param('id') followUserId: string, @Req() req) {
    const author = req.user._id;
    const userToFollow = await this.usersService.findOne(followUserId);
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }
    const authorUser = await this.usersService.findOne(author);
    if (!authorUser.following.includes(followUserId)) {
      throw new NotFoundException('User not followed');
    }
    return this.followsService.unFollowByUser(author, followUserId);
  }

  @Get('list/followers')
  async getFollowers(
    @Req() req,
    @Query() { id }: { id?: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = id ?? req.user._id;
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new NotFoundException('Page or limit not found');
    }
    return this.followsService.getFollowers(userId, currentPage, currentLimit);
  }
  @Get('list/following')
  async getFollowing(
    @Req() req,
    @Query() { id }: { id?: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = id ?? req.user._id;
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new NotFoundException('Page or limit not found');
    }
    return this.followsService.getFollowing(userId, currentPage, currentLimit);
  }
}
