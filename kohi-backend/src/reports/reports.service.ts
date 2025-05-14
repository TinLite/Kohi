import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from 'src/posts/posts.service';
import { Report } from '../reports/schema/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { RejectReportDto } from './dto/reject-report';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    private readonly postsService: PostsService,
  ) {}
  async create(
    createReportDto: CreateReportDto,
    userId: string,
    type: string,
    targetId: string,
  ) {
    const { reason } = createReportDto;
    return this.reportModel.create({
      userId,
      type,
      targetId,
      reason,
    });
  }
  async findOneReportByUserAndTargetId(
    userId: string,
    type: string,
    targetId: string,
  ) {
    return this.reportModel.findOne({ userId, type, targetId });
  }
  async findOneReportByUserAndPostId(userId, postId) {
    return this.reportModel.findOne({ userId, postId });
  }
  findOneReportByUserAndCommentId(userId, commentId) {
    return this.reportModel.findOne({ userId, commentId });
  }
  async findAllReportsByPostId(postId: string) {
    return this.reportModel.find({ postId });
  }
  async findAllReportsByCommentId(commentId: string) {
    return this.reportModel.find({ commentId });
  }
  // Lấy danh sach report
  async findReported(page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    const [data, total] = await Promise.all([
      this.reportModel
        .find(filter)
        .populate('userId', 'username displayName avatar')
        .skip(skip)
        .limit(limit)
        .sort({ handled: 1, createdAt: -1 }),
      this.reportModel.countDocuments(filter),
    ]);
    return {
      data,
      pagination: {
        currentPage: page,
        totalElement: total,
        totalPage: Math.ceil(total / limit),
        limit,
      },
    };
  }
  // reject report
  async rejectReport(
    reportId: string,
    userId: string,
    rejectReportDto: RejectReportDto,
  ) {
    const { handleReason } = rejectReportDto;
    return this.reportModel.findByIdAndUpdate(
      reportId,
      {
        handleResult: 'rejected',
        handledBy: userId,
        handled: true,
        handleReason,
      },
      { new: true },
    );
  }
  // approve report
  async approveReport(reportId: string, userId: string) {
    return this.reportModel.findByIdAndUpdate(
      reportId,
      {
        handleResult: 'approved',
        handledBy: userId,
        handled: true,
      },
      { new: true },
    );
  }
  async findOneReportById(reportId: string) {
    return this.reportModel.findById(reportId);
  }
}
