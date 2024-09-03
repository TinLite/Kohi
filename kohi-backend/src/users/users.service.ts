import { Injectable, Delete, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { hashPassword } from '../Hash/hash';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}
  //check tồn tại email 
  emailExist = async (email: string) => {
    const user = await this.userModel.exists({ email:email });
    if(user)return true;
    return false;
  }
  //CREATE USER
  async create(createUserDto: CreateUserDto){
    const {username,password,email} = createUserDto;
    //check tồn tại email
    const isExist = await this.emailExist(email);
    if(isExist){
      throw new BadRequestException('Email already exists');
    }
    // hashPass
    const hashPass = await hashPassword(password);
    const newUser = await this.userModel.create({ 
      username,
      password:hashPass,
      email
    })
    // console.log(newUser)
    return {
      _id: newUser._id
    }
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
