import { Comment } from './schemas/comment.schema';
import { Injectable, Controller } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  //Create Bình luận
  async createComment(createCommentDto: CreateCommentDto, authorId: string) {
    const { content, postId, replyTo } = createCommentDto;
    const Comment = await this.commentModel.create({
      author: authorId,
      content,
      postId,
      replyTo,
    });
  }
  // //Xóa bình luận cần xong post
  // async deleteComment(commentId: string,author: string) {
  //   const comment = await this.commentModel.findById(commentId);
  //   if (!comment) {
  //     throw new Error('Comment not found');
  //   }
  //   if(comment.author.toString() !== author){
  //     throw new Error('You are not authorized to delete this comment');
  //   }
  //   const deletedComment = await this.commentModel.findByIdAndDelete(commentId);
  //   return deletedComment;
  // }
  
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
    if (!comment) {
      throw new Error('Comment not found');
    }
    if (comment.author.toString() !== author) {
      throw new Error('You are not authorized to update this comment');
    }
  }
}
