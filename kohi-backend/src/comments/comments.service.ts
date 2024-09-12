import { Comment } from './schemas/comment.schema';
import {
  Injectable,
  Controller,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly postsService: PostsService,
  ) {}

  //Create Bình luận
  async createComment(
    createCommentDto: CreateCommentDto,
    authorId: string,
    postId: string,
  ) {
    // console.log(postId);
    const { content, replyTo } = createCommentDto;
    await this.commentModel.create({
      author: authorId,
      content,
      postId: postId,
      replyTo,
    });
  }

  //Update bình luận
  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    author: string,
  ) {
    const comment = await this.commentModel.findByIdAndUpdate(
      commentId,
      updateCommentDto,
      { new: true },
    );
  }
  //reply bình luận
  async replyComment(
    postId: string,
    commentId: string,
    author: string,
    createCommentDto: CreateCommentDto,
  ) {
    const { content, replyTo } = createCommentDto;
    await this.commentModel.findByIdAndUpdate(
      commentId,
      {
        $set: {
          hasReply: true,
        },
      }
    )
    const comment = await this.commentModel.create({
      author: author,
      content,
      postId: postId,
      replyTo: commentId,
    });
    return {
      _id: comment._id,
    };
  }

  //Like comments
  async likeComment(commentId: string, author: string) {
    await this.commentModel.findByIdAndUpdate(
      commentId,
      { $push: { likes: author } },
      { new: true },
    );
  }
  //Remove like comments
  async removeLike(commentId: string, author: string) {
    await this.commentModel.findByIdAndUpdate(
      commentId,
      { $pull: { likes: author } },
      { new: true },
    );
  }
  //Delete bình luận
  async deleteComment(commentId: string, author: string) {
    await this.commentModel.findByIdAndDelete(commentId);
  }
  //Get 1 bình luận
  async getOneComment(commentId: string) {
    return this.commentModel.findById(commentId).exec();
  }
  //Get all bình luận theo bài viết
  async getCommentByPostId(postId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const comment = await this.commentModel
      .find({
        postId: postId,
        replyTo: null,
      })
      .exec();
    const totalComment = await this.commentModel
      .countDocuments({ postId })
      .exec();
    const totalPage = Math.ceil(totalComment / limit);
    return {
      data: comment,
      pagination: {
        currentPage: page,
        totalElement: totalComment,
        totalPage: totalPage,
        limit: limit,
      },
    };
  }
  //get all bình luận theo id bình luận cha
  async getCommentByReplyTo(replyTo: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const comment = await this.commentModel
      .find({
        replyTo: new mongoose.Types.ObjectId(replyTo),
      })
      .exec();
    const totalComment = await this.commentModel
      .countDocuments({ replyTo })
      .exec();
    const totalPage = Math.ceil(totalComment / limit);
    return {
      data: comment,
      pagination: {
        currentPage: page,
        totalElement: totalComment,
        totalPage: totalPage,
        limit: limit,
      },
    };
  }
  
}
