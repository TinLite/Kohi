// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from './schemas/user.schema';
// import { UsersService } from './users.service';
// import { PostsService } from '../posts/posts.service';

// @Injectable()
// export class BookmarkService {
//   constructor(
//     @InjectModel(User.name) private readonly userModel: Model<User>,
//     private readonly usersService: UsersService,
//     private readonly postsService: PostsService,
//   ) {}

//   async addBookMark(userId: string, postId: string) {
//     await this.userModel.findByIdAndUpdate(
//       userId,
//       {
//         $addToSet: { bookmarks: postId },
//       },
//       {
//         new: true,
//       },
//     );
//   }
//   async removeBookMark(userId: string, postId: string) {
//     await this.userModel.findByIdAndUpdate(
//       userId,
//       {
//         $pull: { bookmarks: postId },
//       },
//       {
//         new: true,
//       },
//     );
//   }
//   async listBookMark(userId: string, page: number, limit: number) {
//     const skip = (page - 1) * limit;
//     const bookmarks = await this.userModel
//       .findById(userId)
//       .select('bookmarks')
//       .exec();
//     const totalBookmark = bookmarks.bookmarks.length;
//     const totalPage = Math.ceil(totalBookmark / limit);

//     const listBookmark = await this.userModel
//       .findById(userId)
//       .populate({
//         path: 'bookmarks',
//         model: 'Post',
//         populate: { path: 'author', model: 'User', select: 'username' },
//       })
//       .select('bookmarks')
//       .exec();
//     return {
//       data: listBookmark,
//       pagination: {
//         currentPage: page,
//         totalPage: totalPage,
//         totalElement: totalBookmark,
//         limit: limit,
//       },
//     };
//   }

// }
