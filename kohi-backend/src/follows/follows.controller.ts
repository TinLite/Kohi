import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}
  @Post('/:id')
  async followUser(@Param('id') follơwUserId: string,@Req() req) {
    const currentUserId = req.user._id;
    return this.followsService.followUser(currentUserId, follơwUserId);
  }
  @Post('unfollow/:id')
  async unFollowUser(@Param('id') unfollowUserId: string,@Req() req) {
    const currentUserId = req.user._id;
    return this.followsService.unFollowUser(currentUserId, unfollowUserId);
  }
  
}
