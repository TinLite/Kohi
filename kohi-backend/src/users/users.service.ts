import { Injectable, Delete, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  //CREATE USER
  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;
    //check tồn tại email
    const isExist = await this.userModel.exists({ email: email });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    // hashPass
    const utilsService = new UtilsService();
    const hashPass = await utilsService.hashPassword(password);
    const newUser = await this.userModel.create({
      username,
      password: hashPass,
      email,
    });
    // console.log(newUser)
    return {
      _id: newUser._id,
    };
  }
  // GET ALL USER
  async findAllUser(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const User = await this.userModel.find().exec();
    const totalUser = User.length;
    const totalPage = Math.ceil(totalUser / limit);
    return {
      data:User,
      pagination: {
        currentPage: page,
        totalElement:totalUser,
        totalPage: totalPage,
        limit: limit,
      },
    }
  }
  async findByEmail(email: string){
    return await this.userModel.findOne({ email }).exec();
  }
  //GET Email user
  async findByEmailWithPassword(email: string){
    return await this.userModel.findOne({ email }).select("+password").exec();
  }
  //GET ONE user
  async findOne(id: string): Promise<User> {
     return await this.userModel.findById(id).select('+bio').exec();
  }
  
  async findAllById(id: string[]) {
    return await this.userModel.find({ _id: { $in: id } }).exec();
 }

  //findByIdAndUpdate
  async findByIdAndUpdate(id: string, updateUserDto: UpdateUserDto) {
      
  }
  //DELETE ONE USER
  async deleteOne(id: string) {
    this.userModel.findByIdAndDelete(id).exec();
  }

  //Update 
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel
      .updateOne({ _id: id }, updateUserDto)
      .exec();
    return updateUser;
  }
  //search User
  async searchUser(query: string) {
    const users = await this.userModel.find({
      $or:[
      {username:{$regex: query, $options: 'i'}},
      {email:{$regex: query, $options: 'i'}},
    ]
    });
    return users;
  }
  //lay role
  async getUserRoles(userId: string) {
    const user = await this.userModel.findById(userId).select('+roles').exec();
    return user.roles;
  }
}
