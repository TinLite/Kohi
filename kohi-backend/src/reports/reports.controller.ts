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
  Query,
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
import { RejectReportDto } from './dto/reject-report';
import { RejectPostNotificationDto } from 'src/notifications/dto/reject-report-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('/create/:type/:id')
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
@Roles('admin')
@Get('/list/')
async findReported(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  const currentPage = page ? Number(page) : 1;
  const currentLimit = limit ? Number(limit) : 5;

  if (
    !Number.isInteger(currentPage) ||
    !Number.isInteger(currentLimit) ||
    currentPage <= 0 ||
    currentLimit <= 0
  ) {
    throw new BadRequestException('Malfunctioned page or limit');
  }

  return this.reportsService.findReported(currentPage, currentLimit);
}
  @Roles('admin')
  @Post('/reject/:id')
  async rejectReport(
    @Param('id') reportId: string,
    @Body() rejectReportDto: RejectReportDto,
    @User() user,
  ) {
    const userId = user._id;
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const isExitReport = await this.reportsService.findOneReportById(reportId);
    if (!isExitReport) {
      throw new NotFoundException('Report not found');
    }
    if (isExitReport.handled === true) {
      throw new ConflictException('Report already handled');
    }
      if (isExitReport && isExitReport.userId) {
      await this.notificationsService.createNotificationRejectReport(
        new RejectPostNotificationDto({
          userId: isExitReport.userId,
          type: 'REJECT_REPORT',
        }),
      );
    }

    return this.reportsService.rejectReport(reportId, userId, rejectReportDto);
  }
  @Roles('admin')
  @Post('/approve/:id')
  async approveReport(@Param('id') reportId: string, @User() user) {
    const userId = user._id;
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const isExitReport = await this.reportsService.findOneReportById(reportId);
    if (!isExitReport) {
      throw new NotFoundException('Report not found');
    }
    if (isExitReport.handled === true) {
      throw new ConflictException('Report already handled');
    }
    return this.reportsService.approveReport(reportId, userId);
  }
}
