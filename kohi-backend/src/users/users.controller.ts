import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Roles } from 'src/auth/role.decorator';
import { Public } from '../auth/authmeta';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './schemas/user.schema';
import { UsersService } from './users.service';
// import { FollowsService } from './follows.service';
// import { BookmarkService } from './bookmarks.service';
// import { PostsService } from 'src/posts/posts.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly followsService: FollowsService,
    // private readonly bookmarkService: BookmarkService,
    // private readonly postsService: PostsService,
    // private readonly notificationsService: NotificationsService,
  ) {}

  @Post('create')
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Get('list')
  @Roles(Role.ADMIN)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
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
    return this.usersService.findAllUser(currentPage, currentLimit);
  }

  @Get('profile/:id/detail')
  findOne(@Param('id') id: string, @Req() req) {
    if (id == 'me') {
      id = req.user._id;
    }
    return this.usersService.findOne(id);
  }

  @Delete('profile/:id/delete')
  async deleteOne(@Param('id') id: string, @Req() req) {
    if (id == 'me') {
      id = req.user._id;
    }
    if (mongoose.isValidObjectId(id)) {
      return this.usersService.deleteOne(id);
    } else {
      throw new BadRequestException('Id Not Found');
    }
  }
  @Patch('profile/:id/update')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    if (id == 'me') {
      id = req.user._id;
    }

    await this.usersService.updateUser(id, updateUserDto);
  }

  // update password
  @Patch('profile/:id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Req() req,
  ) {
    if (id == 'me') {
      id = req.user._id;
    }

    const user = await this.usersService.findOneWithPassword(id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    await this.usersService.updatePassword(id, newPassword);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch('avatar/:id/update')
  async updateAvatar(
    @Param('id') id: string,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (id == 'me') {
      id = req.user._id;
    }
    return this.usersService.updateAvatar(id, file);
  }
  @UseInterceptors(FileInterceptor('file'))
  @Patch('wall/:id/update')
  async updateWall(
    @Param('id') id: string,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (id == 'me') {
      id = req.user._id;
    }
    return this.usersService.updateWall(id, file);
  }
  @Get('search')
  @Public()
  async searchUser(@Query('query') query: string, @Req() req) {
    return this.usersService.searchUser(query);
  }

}
