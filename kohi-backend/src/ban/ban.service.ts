import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBanDto } from './dto/create-ban.dto';
import { Ban } from './schema/ban.schema';

@Injectable()
export class BanService {
  private readonly logger = new Logger(BanService.name);
  constructor(@InjectModel(Ban.name) private banModel: Model<Ban>) {}
  async create(createBanDto: CreateBanDto, userId: string, banBy: string) {
    const { reason, types, expiresAt } = createBanDto;
    const validTypes = ['post', 'comment', 'account'];
    if (!validTypes.includes(types)) {
      throw new BadRequestException('Invalid ban type');
    }
    const banned = await this.banModel.create({
      userId,
      reason,
      types,
      expiresAt,
      banBy,
      createdAt: new Date(),
    });

    return banned;
  }

  async unban(
    userId: string,
    types: string,
    unbanBy: string,
    unbanReason: string,
  ) {
    const existingBan = await this.banModel.findOne({ userId, types });
    if (!existingBan) {
      throw new NotFoundException('No ban record found for this user and type');
    }
    await this.banModel.findByIdAndUpdate(existingBan._id, {
      isActive: false,
      unbanBy,
      unbanReason,
    });
    return { message: 'User has been unbanned', ban: existingBan };
  }
  async autoUnban(userId: string, types: string, unbanReason: string) {
    const existingBan = await this.banModel.findOne({ userId, types });

    if (!existingBan) {
      throw new NotFoundException('No ban record found for this user and type');
    }

    existingBan.isActive = false;
    existingBan.unbanReason = unbanReason;
    await existingBan.save();

    return { message: 'User has been unbanned', ban: existingBan };
  }

  async findActiveBan(userId: string, types: string) {
    return this.banModel.findOne({ userId, types, isActive: true });
  }
  async findBansByUserId(userId: string) {
    return this.banModel.find({ userId, isActive: true });
  }
}
