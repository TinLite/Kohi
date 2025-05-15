import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import crypto from 'crypto';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RedisService } from '../redis/redis.service';
import { UtilsService } from '../utils/utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserWithDiscordDto } from './dto/create-userwithdiscord';
import { CreateUserWithGGDto } from './dto/create-userwithgg';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {}
  //CREATE USER
  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;
    //check tồn tại email
    const isExist = await this.userModel.exists({ email: email });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    const verifyCode = crypto.randomBytes(3).toString('hex');
    this.redisService.getClient().then((client) => {
      client
        .set(email, verifyCode, { EX: 60 * 5 })
        .then(() => client.disconnect());
    });
    this.mailerService.sendMail({
      from: 'Kohi',
      to: email,
      subject: 'Welcome to Kohi',
      text: 'Welcome to Kohi. Your verification code is ' + verifyCode,
    });

    // hashPass
    const utilsService = new UtilsService();
    const hashPass = await utilsService.hashPassword(password);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPass,
    });
    // console.log(newUser)

    return { _id: newUser._id };
  }

  async updatePassword(id: string, password: string) {
    const hashPass = await new UtilsService().hashPassword(password);
    return this.userModel.updateOne({ _id: id }, { password: hashPass }).exec();
  }

  // GET ALL USER
  async findAllUser(page: number, limit: number, query?: string) {
    const skip = (page - 1) * limit;

    const filter: any = {
      roles: { $ne: 'admin' },
    };
    if (query) {
      filter.$or = [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
        {
          email: { $regex: query, $options: 'i' },
        },
      ];
    }
    const User = await this.userModel
      .find(filter)
      .select('username displayName email avatar')
      .skip(skip) // Bỏ qua số lượng bản ghi tương ứng với trang trước đó
      .limit(limit) // Giới hạn số lượng bản ghi trả về
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo giảm dần
      .exec();

    const totalUser = await this.userModel.countDocuments({
      roles: { $ne: 'admin' },
    }); // Tổng số người dùng (không áp dụng skip và limit)
    const totalPage = Math.ceil(totalUser / limit);

    return {
      data: User,
      pagination: {
        currentPage: page,
        totalElement: totalUser,
        totalPage: totalPage,
        limit: limit,
      },
    };
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).select('+email').exec();
  }
  //GET Email user
  async findByEmailWithPassword(email: string) {
    return await this.userModel.findOne({ email }).select('+password').exec();
  }
  //GET Email user
  async findByEmaiOrUsernamelWithPassword(query: string) {
    return await this.userModel
      .findOne({ $or: [{ username: query }, { email: query }] })
      .select('+password')
      .exec();
  }
  //GET ONE user
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).select('+bio +email +sdt +roles');
  }
  //GET SessionUser
  async findById(id: string) {
    return this.userModel.findById(id).select('+roles');
  }

  async findOneWithPassword(id: string): Promise<User> {
    return this.userModel.findById(id).select('+password');
  }

  async findAllById(id: string[]) {
    return await this.userModel.find({ _id: { $in: id } }).exec();
  }

  //findByIdAndUpdate
  async findByIdAndUpdate(id: string, updateUserDto: UpdateUserDto) {}
  //DELETE ONE USER
  async deleteOne(id: string) {
    this.userModel.findByIdAndDelete(id).exec();
  }

  //Update
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel
      .updateOne({ _id: id }, updateUserDto)
      .exec();
    console.log(updateUser);
    return updateUser;
  }
  //Update Avatar
  async updateAvatar(id: string, file: Express.Multer.File) {
    // const folder = process.env.CLOUDINARY_FOLDER_USER;
    const uploadImages = await this.cloudinaryService.uploadFiles(
      [file],
      // folder,
    );
    return this.userModel
      .updateOne({ _id: id }, { avatar: uploadImages[0] })
      .exec();
  }

  // Update wall image
  async updateWall(id: string, file: Express.Multer.File) {
    // const folder = process.env.CLOUDINARY_FOLDER_USER;
    const uploadImages = await this.cloudinaryService.uploadFiles(
      [file],
      // folder,
    );
    return this.userModel
      .updateOne({ _id: id }, { wall: uploadImages[0] })
      .exec();
  }

  // search User
  async searchUser(query: string) {
    const users = await this.userModel.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
      ],
    });
    return users;
  }
  //lay role
  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).select('+roles').exec();
    return user?.roles || [];
  }

  async findByName(query: string) {
    return this.userModel
      .find({ username: { $regex: query.toLowerCase(), $options: 'i' } })
      .select('_id username')
      .exec();
  }

  async findByNameOrDisplayName(query: string) {
    return this.userModel
      .find()
      .or([
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } },
      ])
      .exec();
  }

  /**
   * Lấy danh sách ID người dùng
   * @param userId ID người dùng được follow
   * @param skip Số lượng bỏ qua
   * @param limit Số lượng lấy ra
   * @returns Danh sách ID người dùng đang follow người dùng này
   */
  async getFollowers(userId: string, skip = 0, limit = -1) {
    let data = this.userModel
      .find({ following: userId })
      .skip(skip)
      .select('username displayName displayName avatar');

    if (limit !== -1) {
      data = data.limit(limit);
    }
    return data.exec();
  }

  async getFriends(userId: string, skip = 0, limit = -1) {
    let data = this.userModel
      .find({ following: userId })
      .populate('following', 'username displayName following')
      .select('following')
      .skip(skip);

    if (limit !== -1) {
      data = data.limit(limit);
    }
    
    return (await data.exec()).filter((doc) => {
      const following = doc.following;
      return following.includes(userId);
    });
  }

  /**
   * Lấy danh sách ID người dùng mà người dùng này đang follow
   * @param userId ID người dùng
   * @returns Danh sách ID người dùng mà người dùng này đang follow
   */
  async getFollowingIds(userId: string, skip = 0, limit = -1) {
    let data = this.userModel
      .findById(userId)
      .populate('following', 'username displayName')
      .select('following')
      .skip(skip);

    if (limit !== -1) {
      data = data.limit(limit);
    }
    return data.exec();
  }

  /**
   * Lấy danh sách ID người dùng mà người dùng này đang follow
   * @param userId ID người dùng
   * @returns Danh sách ID người dùng mà người dùng này đang follow
   */
  async getFollowerCount(userId) {
    return this.userModel.countDocuments({ following: userId }).exec();
  }

  /**
   * Lấy danh sách ID người dùng mà người dùng này đang follow
   * @param userId ID người dùng
   * @returns Danh sách ID người dùng mà người dùng này đang follow
   */
  async getFollowingCount(userId) {
    const data = await this.userModel
      .findById(userId)
      .select('following')
      .exec();
    return data.following.length;
  }

  /**
   * Thêm người dùng vào danh sách follow
   * @param userId ID người dùng
   * @param followUserId ID người dùng cần follow
   * @returns
   */
  async addFollowing(userId: string, followUserId: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { following: followUserId },
    });
  }

  /**
   * Xóa người dùng khỏi danh sách follow
   * @param userId ID người dùng
   * @param followUserId ID người dùng cần unfollow
   * @returns
   */
  async removeFollowing(userId: string, followUserId: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: { following: followUserId },
    });
  }
  async verifyEmail(email: string) {
    return this.userModel
      .findOneAndUpdate({ email: email }, { verifyEmail: true })
      .exec();
  }
  async findGoogleId(googleId: string) {
    return this.userModel.findOne({ googleId: googleId }).exec();
  }
  async findDiscordId(discordId: string) {
    return this.userModel.findOne({ discordId }).exec();
  }
  async createUserWithGoogle(user: CreateUserWithGGDto) {
    const newUser = await this.userModel.create(user);
    // console.log(newUser);
    return newUser;
  }
  async createUserWithDiscord(user: CreateUserWithDiscordDto) {
    const newUser = await this.userModel.create(user);
    // console.log(newUser);
    return newUser;
  }
  async findByIdAndUpdateWithGG(id, googleId) {
    return this.userModel
      .findByIdAndUpdate({ _id: id }, { googleId: googleId })
      .exec();
  }
  async findByIdAndUpdateWithDiscord(id, discordId) {
    return this.userModel
      .findByIdAndUpdate({ _id: id }, { discordId: discordId })
      .exec();
  }

  // async banUserActions(
  //   userId: string,
  //   actions: ('post' | 'comment' | 'account')[],
  //   reason: string,
  //   expiresAt?: Date,
  // ) {
  //   const updateFields: any = { banReason: reason };

  //   if (actions.includes('account')) {
  //     updateFields.banExpiresAt = expiresAt || null;
  //   }
  //   if (actions.includes('post')) {
  //     updateFields.postBanExpiresAt = expiresAt || null;
  //   }
  //   if (actions.includes('comment')) {
  //     updateFields.commentBanExpiresAt = expiresAt || null;
  //   }

  //   return this.userModel.findByIdAndUpdate(
  //     userId,
  //     {
  //       $addToSet: { banActions: { $each: actions } }, // Thêm các hành động bị cấm
  //       ...updateFields,
  //     },
  //     { new: true },
  //   );
  // }
  // async unbanUserActions(
  //   userId: string,
  //   actions: ('post' | 'comment' | 'account')[],
  // ) {
  //   const updateFields: any = {};

  //   if (actions.includes('account')) {
  //     updateFields.banExpiresAt = null;
  //   }
  //   if (actions.includes('post')) {
  //     updateFields.postBanExpiresAt = null;
  //   }
  //   if (actions.includes('comment')) {
  //     updateFields.commentBanExpiresAt = null;
  //   }

  //   return this.userModel.findByIdAndUpdate(
  //     userId,
  //     {
  //       $pull: { banActions: { $in: actions } }, // Gỡ bỏ các hành động bị cấm
  //       ...updateFields,
  //     },
  //     { new: true },
  //   );
  // }
  // async checkAndUnbanUser() {
  //   const now = new Date();
  //   const users = await this.userModel.find({
  //     banExpired: { $lte: now }, // Chỉ kiểm tra người dùng có thời gian hết hạn ban
  //     banActions: { $exists: true, $not: { $size: 0 } }, // Chỉ kiểm tra người dùng có quyền bị ban
  //   });
  //   for (const user of users) {
  //     const updatedBanActions = user.banActions.filter((action) => {
  //       // Kiểm tra nếu quyền vẫn còn hiệu lực (chưa hết hạn)
  //       if (action === 'post' && user.postBanExpiresAt > now) return true;
  //       if (action === 'comment' && user.commentBanExpiresAt > now) return true;
  //       if (action === 'account' && user.banExpiresAt > now) return true;
  //       return false; // Gỡ bỏ quyền đã hết hạn
  //     });
  //     await this.userModel.findByIdAndUpdate(user._id, {
  //       banActions: updatedBanActions,
  //       ...(updatedBanActions.length === 0 && {
  //         banReason: null,
  //         banExpired: null,
  //       }), // Xóa lý do và thời gian hết hạn nếu không còn quyền bị ban
  //     });
  //   }
  // }
}
