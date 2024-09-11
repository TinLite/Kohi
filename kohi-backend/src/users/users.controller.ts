import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  NotFoundException,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { Public } from '../auth/authmeta';
import { Roles } from 'src/auth/role.decorator';
import { Role } from './schemas/user.schema';
import { FollowsService } from './follows.service';
import { BookmarkService } from './bookmarks.service';
import { PostsService } from 'src/posts/posts.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly followsService: FollowsService,
    private readonly bookmarkService: BookmarkService,
    private readonly postsService: PostsService,
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
    if (mongoose.isValidObjectId(id)) {
      return this.usersService.deleteOne(id);
    } else {
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

  @Get('follows/followers')
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
  @Get('follows/following')
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
  //add bookmark
  @Post('profile/bookmark/add/:id')
  async addBookmark(@Param('id') postId: string, @Req() req) {
    const author = req.user._id;
    const user = await this.usersService.findOne(author);
    const post = await this.postsService.findOne(postId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (user.bookmarks.includes(postId)) {
      throw new NotFoundException('Post already bookmarked');
    }
    return this.bookmarkService.addBookMark(author, postId);
  }

  @Post('profile/bookmark/remove/:id')
  async removeBookmark(@Param('id') postId: string, @Req() req) {
    const author = req.user._id;
    const user = await this.usersService.findOne(author);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.bookmarks.includes(postId)) {
      throw new NotFoundException('Post not bookmarked');
    }
    return this.bookmarkService.removeBookMark(author, postId);
  }

  @Get('profile/bookmark')
  async listBookMark(
    @Req() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const author = req.user._id;
    const user = await this.usersService.findOne(author);
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new NotFoundException('Page or limit not found');
    }
    return this.bookmarkService.listBookMark(author, currentPage, currentLimit);
  }

}
