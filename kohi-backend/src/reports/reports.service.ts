import { forwardRef, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from '../reports/schema/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
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
  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
  async findAllReportsByPostId(postId: string) {
    return this.reportModel.find({ postId });
  }
  async findAllReportsByCommentId(commentId: string) {
    return this.reportModel.find({ commentId });
  }
}
