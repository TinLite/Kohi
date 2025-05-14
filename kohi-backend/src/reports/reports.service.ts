import { forwardRef, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from '../reports/schema/report.schema';
import { PostsService } from 'src/posts/posts.service';
import { console } from 'inspector';

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
  findAll() {
    return `This action returns all reports`;
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
  async getReportedPosts(): Promise<any[]> {
    return this.reportModel.aggregate([
      { $match: { type: 'post' } },
      {
        $group: {
          _id: '$targetId',
          reportCount: { $sum: 1 },
          reports: { $push: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'postInfo',
        },
      },
      {
        $unwind: '$postInfo',
      },
      { $sort: { reportCount: -1 } },
    ]);
  }
}
