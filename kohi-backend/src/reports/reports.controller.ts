import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadGatewayException,
  ConflictException,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { User } from 'src/auth/user.decorator';
import { PostsService } from 'src/posts/posts.service';
import { CommentsService } from 'src/comments/comments.service';
import { Schema } from 'mongoose';
import { Role } from 'src/users/schemas/user.schema';
import { Roles } from 'src/auth/role.decorator';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post('/post/:id')
  async create(
    @Body() createReportDto: CreateReportDto,
    @User() User,
    @Param('id') postId: string,
  ) {
    const userId = User._id;
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const isExitPost = await this.postsService.findOneNoPopulate(postId);
    if (!isExitPost) {
      throw new NotFoundException('Post not found');
    }
    const isReported = await this.reportsService.findOneReportByUserAndPostId(
      userId,
      postId,
    );
    if (isReported) {
      throw new ConflictException('You already reported this post');
    }
    return this.reportsService.create(createReportDto, userId, postId);
  }
  @Post('/comment/:id')
  async createCommentReport(
    @Body() createReportDto: CreateReportDto,
    @User() User,
    @Param('id') commentId: string,
  ) {
    const userId = User._id;
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const isExitComment = await this.commentsService.getOneComment(commentId);
    // console.log(isExitComment);
    if (!isExitComment) {
      throw new NotFoundException('Comment not found');
    }
    const isReported =
      await this.reportsService.findOneReportByUserAndCommentId(
        userId,
        commentId,
      );
    if (isReported) {
      throw new ConflictException('You already reported this comment');
    }
    return this.reportsService.create(
      createReportDto,
      userId,
      undefined,
      commentId,
    );
  }
  @Roles('admin')
  @Post('/hide/post/:id')
  async hidePost(@Param('id') postId: string, @User() user) {
    const userId = user._id;
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const isExitPost = await this.postsService.findOneNoPopulate(postId);
    if (!isExitPost) {
      throw new NotFoundException('Post not found');
    }
    return this.postsService.hidePost(postId);
  }
  @Roles('admin')
  @Post('/hide/comment/:id')
  async hideComment(@Param('id') commentId: string, @User() user) {
    const userId = user._id;
   
    const isExitComment = await this.commentsService.getOneComment(commentId);
    if (!isExitComment) {
      throw new NotFoundException('Comment not found');
    }
    return this.commentsService.hideComment(commentId);
  }
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
