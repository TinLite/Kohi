import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      prompt: 'select_account',
    });
  }
  async validate(_: any, __: any, profile: any, done: VerifyCallback) {
    if (!profile.emails || profile.emails.length === 0) {
      throw new NotFoundException('Email not found ');
    }
    let user = await this.userService.findGoogleId(profile.id);
    if (!user) {
      user = await this.authService.validateGoogleUser(profile);
    }
    // console.log(user);
    done(null, user);
  }
}
