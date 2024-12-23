import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { Bookmark } from './schemas/bookmark.schema';
import path from 'path';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async addBookMark(userId: string, postId: string) {
    await this.userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { bookmarks: postId },
      },
      {
        new: true,
      },
    );
  }
  async removeBookMark(userId: string, postId: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: { bookmarks: postId },
    });
  }
  async listBookMark(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const bookmarks = await this.userModel
      .findById(userId)
      .select('bookmarks')
      .exec();
    const totalBookmark = bookmarks.bookmarks.length;
    const totalPage = Math.ceil(totalBookmark / limit);
    const listBookmark = await this.userModel
      .findById(userId)
      .populate({
        path: 'bookmarks',
        model: 'Post',
        populate: [
          {
            path: 'author',
            model: 'User',
            select: 'username displayname avatar',
          },
          {
            path: 'postShare',
            populate: {
              path: 'author',
              model: 'User',
              select: 'username displayname avatar',
            },
          },
        ],
      })
      .select('bookmarks -_id')
      .exec();
    return {
      data: listBookmark.bookmarks,
      pagination: {
        currentPage: page,
        totalPage: totalPage,
        totalElement: totalBookmark,
        limit: limit,
      },
    };
  }
  async searchBookMark(query: string, userId: string) {
    const user = await this.usersService.findOne(userId);
    const bookmarks = user.bookmarks;
    const users = await this.usersService.findByNameOrDisplayName(query);
    const userIds = users.map((user) => user._id);
    const posts = await this.postsService.findPosts({
      _id: { $in: bookmarks },
      $or: [
        { content: { $regex: query, $options: 'i' } },
        { author: { $in: userIds } },
      ],
    });
    return posts;
  }
}
