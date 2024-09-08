import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { Public } from '../auth/authmeta';
import { Roles } from 'src/auth/role.decorator';
import { Role } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

}
