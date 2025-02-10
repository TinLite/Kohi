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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    if (req.session.user) {
      throw new ForbiddenException('You are already logged in');
    }
    req.session.user = req.user;
    return req.user;
  }
  @Get('profile')
  getProfile(@Request() req) {
    if (!req.session.user) {
      return { message: 'Unauthorized access' };
    }
    return { user: req.session.user };
  }
}
