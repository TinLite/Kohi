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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Public } from 'src/auth/authmeta';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/auth/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return { id: (await this.usersService.create(createUserDto))._id };
  }
  @Roles('admin')
  @Get('list')
  async findAll(
    @User() user,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('query') query?: string,
  ) {
    // console.log('User:', user); // Debugging user object
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
    return this.usersService.findAllUser(currentPage, currentLimit,query);
  }

  @Get('friends')
  async findFriends(@User() user) {
    return this.usersService.getFriends(user._id);
  }

  @Get('profile/:id/detail')
  findOne(@Param('id') id: string, @User() user) {
    if (id == 'me') {
      id = user?._id;
    }
    return this.usersService.findOne(id);
  }

  @Delete('profile/:id/delete')
  async deleteOne(@Param('id') id: string, @User() user) {
    if (id == 'me') {
      id = user?._id;
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
    @User() user,
  ) {
    if (id == 'me') {
      id = user._id;
    }

    await this.usersService.updateUser(id, updateUserDto);
  }

  // update password
  @Patch('profile/:id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @User() reqUser,
  ) {
    if (id == 'me') {
      id = reqUser._id;
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
    @User() user,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (id == 'me') {
      id = user._id;
    }
    return this.usersService.updateAvatar(id, file);
  }
  @UseInterceptors(FileInterceptor('file'))
  @Patch('wall/:id/update')
  async updateWall(
    @Param('id') id: string,
    @User() user,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (id == 'me') {
      id = user._id;
    }
    return this.usersService.updateWall(id, file);
  }
  @Get('search')
  async searchUser(@Query('query') query: string, @User() user) {
    return this.usersService.searchUser(query);
  }
}
