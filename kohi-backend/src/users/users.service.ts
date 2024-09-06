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
  //check tồn tại email
  emailExist = async (email: string) => {
    const user = await this.userModel.exists({ email: email });
    if (user) return true;
    return false;
  };
  //CREATE USER
  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;
    //check tồn tại email
    const isExist = await this.emailExist(email);
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
  async findAll(): Promise<User[]> {
    return this.userModel.find({}, { password: 0 }).exec();
  }
  //GET Email user
  async findByEmail(email: string){
    return await this.userModel.findOne({ email }).exec();
  }
  //GET ONE user
  async findOne(id: string): Promise<User> {
     return await this.userModel.findById(id, { password: 0 }).exec();
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
    const user = await this.userModel.findById(userId).exec();
    return user.roles;
  }
}
