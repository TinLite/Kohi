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
  BadRequestException,
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

  @Post('/:type/:id')
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @User() user,
    @Param('type') type: 'post' | 'comment',
    @Param('id') targetId: string,
  ) {
    const userId = user._id;

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra đối tượng tồn tại
    if (type === 'post') {
      const isExistPost = await this.postsService.findOneNoPopulate(targetId);
      if (!isExistPost) {
        throw new NotFoundException('Post not found');
      }
    } else if (type === 'comment') {
      const isExistComment = await this.commentsService.getOneComment(targetId);
      if (!isExistComment) {
        throw new NotFoundException('Comment not found');
      }
    } else {
      throw new BadRequestException('Invalid report type');
    }

    // Kiểm tra xem đã report chưa
    const isReported = await this.reportsService.findOneReportByUserAndTargetId(
      userId,
      type,
      targetId,
    );
    if (isReported) {
      throw new ConflictException(`You already reported this ${type}`);
    }

    // Tạo report
    return this.reportsService.create(createReportDto, userId, type, targetId);
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
