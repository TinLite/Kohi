import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/schemas/user.schema';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from './authmeta';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // login no guard
  // @Post('login')
  // async login(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.signIn(
  //     createAuthDto.username,
  //      createAuthDto.password);
  // }

  // login with guard
  @UseGuards(LocalAuthGuard)
  @Public() // Để k check jwt
  @Post('login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
