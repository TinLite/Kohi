import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UtilsService } from '../utils/utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  //CREATE USER
  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;
    //check tồn tại email
    const isExist = await this.userModel.exists({ email: email });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    // hashPass
    const utilsService = new UtilsService();
    const hashPass = await utilsService.hashPassword(password);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPass,
    });
    // console.log(newUser)
    return {
      _id: newUser._id,
    };
  }

  async updatePassword(id: string, password: string) {
    const hashPass = await new UtilsService().hashPassword(password);
    return this.userModel.updateOne({ _id: id }, { password: hashPass }).exec();
  }

  // GET ALL USER
  async findAllUser(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const User = await this.userModel.find().exec();
    const totalUser = User.length;
    const totalPage = Math.ceil(totalUser / limit);
    return {
      data: User,
      pagination: {
        currentPage: page,
        totalElement: totalUser,
        totalPage: totalPage,
        limit: limit,
      },
    };
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }
  //GET Email user
  async findByEmailWithPassword(email: string) {
    return await this.userModel.findOne({ email }).select('+password').exec();
  }
  //GET Email user
  async findByEmaiOrUsernamelWithPassword(query: string) {
    return await this.userModel.findOne({ $or: [ { username: query }, { email: query } ] }).select('+password').exec();
  }
  //GET ONE user
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).select('+bio +email +sdt');
  }

  async findOneWithPassword(id: string): Promise<User> {
    return this.userModel.findById(id).select('+password');
  }

  async findAllById(id: string[]) {
    return await this.userModel.find({ _id: { $in: id } }).exec();
  }

  //findByIdAndUpdate
  async findByIdAndUpdate(id: string, updateUserDto: UpdateUserDto) {}
  //DELETE ONE USER
  async deleteOne(id: string) {
    this.userModel.findByIdAndDelete(id).exec();
  }

  //Update
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel
      .updateOne({ _id: id }, updateUserDto)
      .exec();
    console.log(updateUser);
    return updateUser;
  }
  //Update Avatar
  async updateAvatar(id: string, file: Express.Multer.File) {
    const folder = process.env.CLOUDINARY_FOLDER_USER;
    const uploadImages = await this.cloudinaryService.uploadFiles(
      [file],
      folder,
    );
    return this.userModel
      .updateOne({ _id: id }, { avatar: uploadImages[0] })
      .exec();
  }

  // Update wall image
  async updateWall(id: string, file: Express.Multer.File) {
    const folder = process.env.CLOUDINARY_FOLDER_USER;
    const uploadImages = await this.cloudinaryService.uploadFiles(
      [file],
      folder,
    );
    return this.userModel
      .updateOne({ _id: id }, { wall: uploadImages[0] })
      .exec();
  }

  // search User
  async searchUser(query: string) {
    const users = await this.userModel.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
      ],
    });
    return users;
  }
  //lay role
  async getUserRoles(userId: string) {
    const user = await this.userModel.findById(userId).select('+roles').exec();
    return user.roles;
  }

  async findByName(query: string) {
    return this.userModel
      .find({
        username: { $regex: query.toLowerCase(), $options: 'i' },
      })
      .select('_id username')
      .exec();
  }
  async findByNameOrDisplayName(query: string) {
    return this.userModel
      .find()
      .or([
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
      ])
      .exec();
  }
  async getFollowers(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('followers')
      .exec();
    return user.followers;
  }
}
