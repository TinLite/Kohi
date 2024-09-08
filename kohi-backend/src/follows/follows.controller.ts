import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { UsersService } from 'src/users/users.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService,
    private readonly usersService: UsersService
  ) {}
  @Post('/:id')
  async followByUser(@Param('id') followUserId: string,@Req() req) {
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
    return this.followsService.followByUser(author, followUserId);
  }

  @Post('unfollow/:id')
  async unFollowByUser(@Param('id') followUserId: string,@Req() req) {
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
  
}
