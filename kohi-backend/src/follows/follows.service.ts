import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
  ) {}
  async followUser(currentUserId: string, followUserId: string) {
    const userToFollow = await this.usersService.findOne(followUserId);
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }
    const currentUser = await this.userModel.findById(currentUserId);
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }
    if (!currentUser.following) {
      currentUser.following = [];
    }
    if (currentUser.following.includes(followUserId)) {
      throw new NotFoundException('User already followed');
    }
    const user = await this.userModel.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: followUserId } },
      { new: true },
    );
    // return user;
  }
  async unFollowUser(currentUserId: string, followUserId: string) {
    const userToFollow = await this.usersService.findOne(followUserId);
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }

    const user = await this.userModel.findByIdAndUpdate(currentUserId, {
      $pull: { following: followUserId },
    });
    // return user;
  }
  // Get ALL follower

}
