import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from './authmeta';
import { Roles } from './role.decorator';
import { MailerService } from '@nestjs-modules/mailer';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly mailerService: MailerService
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
  @Get('email')
  testmail() {
    this.mailerService.sendMail({
      from: 'Kohi',
      to: 'lequangtien136@gmail.com',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
    });
    return "ok cuc cung";
  }
}
