import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
    private readonly NotificationsService: NotificationsService,
  ) {}
  //Follow người dùng
  async followByUser(author: string, followUserId: string) {
    await this.userModel.findByIdAndUpdate(
      author,
      {
        $addToSet: { following: followUserId },
      },
    );
    await this.userModel.findByIdAndUpdate(
      followUserId,
      {
        $addToSet: { followers: author },
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
  async getFollowers(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const userFollower = await this.userModel
      .findById(userId)
      .select('followers')
      .exec();
    const totalUser = userFollower.followers.length;
    const totalPage = Math.ceil(totalUser / limit);
    const followers = await this.userModel
      .findById(userId)
      .skip(skip)
      .populate('followers', 'username displayName')
      .select('followers')
      .exec();
    return {
      data: followers,
      pagination: {
        currentPage: page,
        totalPage: totalPage,
        totalElement: totalUser,
        limit: limit,
      },
    };
  }
  async getFollowing(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const userFollowing = await this.userModel
      .findById(userId)
      .select('following')
      .exec();

    const totalUser = userFollowing.following.length;

    const totalPage = Math.ceil(totalUser / limit);

    const user = await this.userModel
      .findById(userId)
      .populate('following', 'username displayName')
      .select('following')
      .skip(skip)
      .limit(limit)
      .exec();
    return {
      data: user.following,
      pagination: {
        currentPage: page,
        totalPage: totalPage,
        totalElement: totalUser,
        limit: limit,
      },
    };
  }

  async getUserById(userId: string) {
    return await this.userModel.findById(userId).select('following').exec();
  }
  async getFollowingByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.userModel
      .findById(userId)
      .populate('following', 'username displayName')
      .select('following')
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
