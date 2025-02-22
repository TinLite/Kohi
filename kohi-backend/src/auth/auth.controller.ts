import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from './authmeta';
import { Roles } from './role.decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './user.decorator';
import { UsersService } from '../users/users.service';
import crypto, { verify } from 'crypto';
import { RedisService } from 'src/redis/redis.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    if (req.session.user) {
      throw new ForbiddenException('You are already logged in');
    }
    req.session.user = req.user;
    return req.user;
  }

  @Post('logout')
  async logout(@Request() req) {
    req.session.destroy();
  }
  @Get('profile')
  getProfile(@Request() req) {
    if (!req.session.user) {
      return { message: 'Unauthorized access' };
    }
    return { user: req.session.user };
  }
  // @Get('email')
  // testmail() {
  //   this.mailerService.sendMail({
  //     from: 'Kohi',
  //     to: 'lequangtien136@gmail.com',
  //     subject: 'Testing Nest MailerModule ✔',
  //     text: 'welcome',
  //   });
  //   return "ok cuc cung";
  // }
  @Post('email')
  async emailAuth(@User() req, @Request() request) {
    const { email } = request.body;
    const emailUser = await this.usersService.findByEmail(email);
    // console.log(emailUser.email);
    // console.log(email);
    if (emailUser.email !== email) {
      throw new BadRequestException('Email does not match');
    }
    const verifyCode = await crypto.randomBytes(3).toString('hex');
    const key = `verifyCode: ${email}`;
    this.redisService.getClient().then((client) => {
      client
        .set(key, verifyCode, {
          EX: 60 * 5,
        })
        .then(() => client.disconnect());
    });
    const sendTo = await this.mailerService.sendMail({
      from: 'Kohi',
      to: email,
      subject: 'This is your verification code to email authentication',
      html: `Please use this code to verify your email: <strong>${verifyCode}</strong>`,
    });
    return sendTo.accepted;
  }
  @Post('email/verify')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;
    const key = `verifyCode: ${email}`;
    const client = await this.redisService.getClient();
    const verifyCode = await client.get(key);
    if (verifyCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }
    return this.usersService.verifyEmail(email);
  }
}
