import { Injectable, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}
  //CREATE USER
  async create(createUserDto: CreateUserDto): Promise<void> {
    const newUser = new this.userModel(createUserDto);
    await newUser.save();
  }
  // GET ALL USER 
  async findAll():Promise<User[]> {
    return this.userModel.find({},{password:0}).exec();
  }
  //GET ONE user
  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id,{password:0}).exec();
  }
  //DELETE ONE USER
  async deleteOne(id: string) {
    this.userModel.findByIdAndDelete(id).exec();
  }

  //CH LÀM
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.updateOne({_id:id},updateUserDto).exec();
    return updateUser;
  }


}
