import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BanService } from './ban.service';
import { UsersService } from 'src/users/users.service';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/auth/user.decorator';

@Controller('ban')
export class BanController {
  constructor(
    private readonly banService: BanService,
    private readonly userService: UsersService,
  ) {}
  @Roles('admin')
  @Post('/user/:userId')
  async create(
    @Body() createBanDto: CreateBanDto,
    @User() user,
    @Param('userId') userId: string,
  ) {
    if (!user) {
      throw new BadRequestException('User performing the ban not found');
    }
    const targetUser = await this.userService.findOne(userId);
    if (!targetUser) {
      throw new BadRequestException('User to be banned not found');
    }
    return this.banService.create(createBanDto, userId, user._id);
  }

  @Roles('admin')
  @Delete('/unban/user/:userId')
  async unban(
    @Body('types') types: string,
    @Body('unbanReason') unbanReason: string,
    @User() user,
    @Param('userId') userId: string,
  ) {
    if (!user) {
      throw new NotFoundException('User performing the unban not found');
    }
    const targetUser = await this.userService.findOne(userId);
    if (!targetUser) {
      throw new NotFoundException('User to be unbanned not found');
    }
    return this.banService.unban(userId, types, user._id, unbanReason);
  }
  @Roles('admin')
  @Get('/user/:userId')
  async getBan(@Param('userId') userId: string) {
    const targetUser = await this.userService.findOne(userId);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }
    return this.banService.findBansByUserId(userId);
  }
}
