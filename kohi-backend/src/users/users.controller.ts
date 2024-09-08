import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query, NotFoundException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { Public } from '../auth/authmeta';
import { Roles } from 'src/auth/role.decorator';
import { Role } from './schemas/user.schema';
import { FollowsService } from './follows.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly followsService: FollowsService
  ) {}

  @Post('create')
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Get('list')
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
    
  }

  @Get('profile/:id/detail')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete('profile/:id/delete')
  async deleteOne(@Param('id') id: string) {
    if(mongoose.isValidObjectId(id)){
      return this.usersService.deleteOne(id);
    }else{
      throw new BadRequestException('Id Not Found');
    }
  }

  @Patch('profile/:id/update')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.updateUser(id, updateUserDto);
  }

  @Get('search')
  @Public()
  async searchUser(@Query('query') query: string) {
    const users = await this.usersService.searchUser(query);
    return users;
  }

  @Post('follow/:id')
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
    return this.followsService.followByUser(author, followUserId);
  }

  @Post('follow/unfollow/:id')
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

  @Get('follow/followers')
  async getFollowers(@Req() req) {
    const userId = req.user._id;
    return this.followsService.getFollowers(userId);
  }
}
