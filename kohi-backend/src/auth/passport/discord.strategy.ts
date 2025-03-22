import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from '../auth.service';
import { VerifiedCallback } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'email'],
    });
  }
  async validate(_: any, __: any, profile: any, done: VerifiedCallback) {
    let user = await this.userService.findDiscordId(profile.id);
    if (!user) {
      user = await this.authService.validateDiscordUser(profile);
    }
    done(null, user);
  }
}
