import { Comment } from './schemas/comment.schema';
import { Injectable, Controller, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    console.log(postId);
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
    commentId: string,
    replyCommentDto: CreateCommentDto,
    author: string,
  ) {
    const { content } = replyCommentDto;
    const comment = await this.commentModel.findByIdAndUpdate(
      commentId,
      {
        $push: { replies: { content, author } },
      },
      {
        new: true,
      }
    );
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
    )
  }
  //Delete bình luận
  async deleteComment(commentId: string, author: string) {
    await this.commentModel.findByIdAndDelete(commentId);
  }
  //Get bình luận
  async getOneComment(commentId: string) {
    return this.commentModel.findById(commentId).exec();
  }
}
