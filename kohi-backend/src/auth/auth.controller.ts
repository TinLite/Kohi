import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Patch,
  Post,
  Request,
  Res,
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
import { AuthGuard } from '@nestjs/passport';
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
  @Public()
  @Post('email')
  async emailAuth(@User() req, @Request() request) {
    const { email } = request.body;
    const emailUser = await this.usersService.findByEmail(email);
    // // console.log(emailUser.email);
    // // console.log(email);
    // if (emailUser.email !== email) {
    //   throw new BadRequestException('Email does not match');
    // }
    if (!emailUser) {
      throw new NotFoundException('Email does not exist');
    }
    const verifyCode = await crypto.randomInt(100000, 999999).toString();
    const key = `verifyCode: ${email}`;
    this.redisService.getClient().then((client) => {
      client
        .set(key, verifyCode, { EX: 60 * 5 })
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
  @Public()
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
  @Public()
  @Patch('reset-password')
  async resetPassword(@Body() body) {
    const { email, password } = body;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    //@ts-expect-error
    return this.usersService.updatePassword(user._id, password);
  }
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return 'Google login';
  }
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Request() req, @Res() res) {
    if (!req.user) {
      throw new BadGatewayException('Google login failed');
    }
    
    req.session.user = req.user;
    return res.json(req.user);
  }
}
