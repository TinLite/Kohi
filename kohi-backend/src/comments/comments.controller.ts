import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostsService } from 'src/posts/posts.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService,
    private readonly postsService: PostsService
  ) {}

  @Post('create/:id')
  async createComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    const authorId = req.user._id;
    await this.commentsService.createComment(
      createCommentDto,
      authorId,
      postId,
    );
  }

  // Update bình luận
  @Patch('update/:id')
  async updateComment(
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req,
  ) {
    const author = req.user._id;
    const comment = await this.commentsService.getOneComment(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== author) {
      throw new ForbiddenException('You are not authorized to reply this comment');
    }
    return this.commentsService.updateComment(
      commentId,
      updateCommentDto,
      author,
    );
  }

  //Like bình luận
  @Post('like/:id')
  async likeComment(@Param('id') commentId: string, @Req() req) {
    const author = req.user._id;
    const comment = await this.commentsService.getOneComment(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.likes.includes(author)) {
      throw new NotFoundException('You have already liked this comment');
    }
    return this.commentsService.likeComment(commentId, author);
  }
  //Remove like bình luận
  @Post('unlike/:id')
  async removeLike(@Param('id') commentId: string, @Req() req) {
    const author = req.user._id;
    const comment = await this.commentsService.getOneComment(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (!comment.likes.includes(author)) {
      throw new NotFoundException('You have not liked this comment');
    }
    return this.commentsService.removeLike(commentId, author);
  }

  //Delete bình luận
  @Delete('delete/:id')
  async deleteComment(@Param('id') commentId: string, @Req() req) {
    const author = req.user._id;
    const comment = await this.commentsService.getOneComment(commentId);
    const post = await this.postsService.findOne(comment.postId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.toString() !== author && post.author.toString() !== author) {
      throw new NotFoundException('You are not authorized to delete this comment');
    }
    
    return this.commentsService.deleteComment(commentId, author);
  }
  
}
