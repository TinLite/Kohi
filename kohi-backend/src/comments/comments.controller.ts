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
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostsService } from 'src/posts/posts.service';
import { Role } from 'src/users/schemas/user.schema';
import { Roles } from 'src/auth/role.decorator';
import { Public } from 'src/auth/authmeta';
import { NewCommentNotificationDto } from 'src/notifications/dto/new-comment-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { LIKECommentNotificationDto } from 'src/notifications/dto/new-likecomment-notification.dto';
import { NewReplyCommentNotificationDto } from 'src/notifications/dto/new-reply-comment-notification.dto';
import { User } from 'src/auth/user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('create/:id')
  async createComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() req,
  ) {
    const authorId = req._id;
    // console.log('authorId', authorId);
    const comment = await this.commentsService.createComment(
      createCommentDto,
      authorId,
      postId,
    );
    const data = await this.postsService.findOne(postId);
    // .depopulate('author');
    if (authorId != data.author) {
      const notification =
        await this.notificationsService.createNotificationNewComment(
          new NewCommentNotificationDto({
            userId: data.author,
            otherUser: authorId,
            post: postId,
            comment: comment._id,
          }),
        );
    }
    return comment;
  }

  // Update bình luận
  @Patch('update/:id')
  async updateComment(
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() req,
  ) {
    const author = req._id;
    const comment = await this.commentsService.getOneComment(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author != author) {
      throw new ForbiddenException(
        'You are not authorized to reply this comment',
      );
    }
    return this.commentsService.updateComment(
      commentId,
      updateCommentDto,
      author,
    );
  }
  //reply bình luận
  @Post('reply/:id')
  async replyComment(
    @Param('id') commentId: string,
    @Body() replyCommentDto: CreateCommentDto,
    @User() req,
  ) {
    const author = req._id;
    const commentOld = await this.commentsService.getOneComment(commentId);
    if (!commentOld) {
      throw new NotFoundException('Comment not found');
    }
    //@ts-expect-error
    const postId = commentOld.postId._id;
    const authorID = commentOld.author;
    const commented = await this.commentsService.replyComment(
      postId,
      commentId,
      author,
      replyCommentDto,
    );
    if (authorID != author) {
      await this.notificationsService.createNotificationReplyComment(
        new NewReplyCommentNotificationDto({
          userId: authorID,
          otherUser: author,
          post: postId,
          comment: commented._id,
        }),
      );
    }
    return {
      _id: commented._id,
    };
  }
  //Like bình luận
  @Post('like/:id')
  async likeComment(@Param('id') commentId: string, @User() req) {
    const author = req._id;
    const comment = await this.commentsService.getOneComment(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.likes.includes(author)) {
      throw new NotFoundException('You have already liked this comment');
    }
    const authorId = comment.author;
    if (authorId != author) {
      const notification =
        await this.notificationsService.createNotificationLikeComment(
          new LIKECommentNotificationDto({
            userId: authorId,
            otherUser: author,
            post: comment.postId,
            comment: commentId,
          }),
        );
    }
    return this.commentsService.likeComment(commentId, author);
  }
  //Remove like bình luận
  @Delete('unlike/:id')
  async removeLike(@Param('id') commentId: string, @User() req) {
    const author = req._id;
    const comment = await this.commentsService.getOneComment(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (!comment.likes.includes(author)) {
      throw new NotFoundException('You have not liked this comment');
    }
    const notification =
      await this.notificationsService.findOneLikeCommentNotification(
        author,
        commentId,
      );
    if (notification) {
      await this.notificationsService.remove(notification._id.toString());
    }
    return this.commentsService.removeLike(commentId, author);
  }

  //Delete bình luận
  @Delete('delete/:id')
  async deleteComment(@Param('id') commentId: string, @User() req) {
    const author = req._id;
    const comment = await this.commentsService.getOneComment(commentId);
    // console.log(comment);
    //@ts-expect-error
    const post = await this.postsService.findOne(comment.postId._id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    //@ts-expect-error
    if(comment.author._id.toString() !== author && post.author._id.toString() !== author
    ) {
      throw new NotFoundException(
        'You are not authorized to delete this comment',
      );
    }
    // console.log('aaa', commentId);
    const notification =
      await this.notificationsService.findOneCommentNotification(commentId);
    // console.log(notification);
    if (notification) {
      this.notificationsService.remove(notification._id.toString());
    }
    const result = await this.commentsService.deleteComment(commentId, author);
    // console.log('Delete result', result);
  }
  // @Roles(Role.ADMIN)
  // @Public()
  @Get('list/:id')
  async getCommentByPostId(
    @Param('id') postId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new BadRequestException('Malfunctioned page or limit');
    }
    return this.commentsService.getCommentByPostId(
      postId,
      currentPage,
      currentLimit,
    );
  }
  // get bình luận theo replyTo
  // @Public()
  @Get('list/reply/:id')
  async getCommentByReplyTo(
    @Param('id') commentId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const comment = await this.commentsService.getOneComment(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new BadRequestException('Malfunctioned page or limit');
    }
    return this.commentsService.getCommentByReplyTo(
      commentId,
      currentPage,
      currentLimit,
    );
  }
  
}
