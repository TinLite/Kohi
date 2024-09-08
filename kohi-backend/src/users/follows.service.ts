import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
  ) {}

  //Follow người dùng
  async followByUser(author: string, followUserId: string) {
    await this.userModel.findByIdAndUpdate(
      author,
      {
        $addToSet: { following: followUserId },
      },
      {
        new: true,
      },
    );
    await this.userModel.findByIdAndUpdate(
      followUserId,
      {
        $addToSet: { followers: author },
      },
      {
        new: true,
      },
    );
  }
  // UnFollow người dùng
  async unFollowByUser(author: string, followUserId: string) {
    await this.userModel.findByIdAndUpdate(author, {
      $pull: { following: followUserId },
    });
    await this.userModel.findByIdAndUpdate(followUserId, {
      $pull: { followers: author },
    });
  }
  // Get ALL follower
  async getFollowers(userId: string) {
    return this.userModel
      .findById(userId)
      .populate({
        path: 'followers', // Trường chứa userId của follower
        select: 'username', // Chỉ lấy field 'username'
      })
      .exec();
  }
}
