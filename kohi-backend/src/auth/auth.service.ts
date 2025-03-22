import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../utils/utils.service';
import { CreateUserWithGGDto } from '../users/dto/create-userwithgg';
import { CreateUserWithDiscordDto } from 'src/users/dto/create-userwithdiscord';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private utilsService: UtilsService,
  ) {
    this.utilsService = new UtilsService();
  }

  private readonly logger = new Logger(typeof this);

  async validateUser(username: string, pass: string): Promise<any> {
    const user =
      await this.usersService.findByEmaiOrUsernamelWithPassword(username);
    // this.logger.debug(`Fetched data for ${username}. Response: ${user}`)
    if (
      !user ||
      !(await this.utilsService.comparePassword(pass, user.password))
    ) {
      return null;
    }
    return {
      _id: user._id,
      username: user.username,
      displayname: user.displayName,
      role: user.roles,
      verify: user.verifyEmail,
    };
  }
  async validateGoogleUser(profile: any): Promise<any> {
    const { id, displayName, photos } = profile;
    const email = profile.emails?.[0]?.value || null;
    const avatar = photos?.[0]?.value || null;
    // const user = await this.usersService.findGoogleId(id);
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      if (existingUser && !existingUser.googleId) {
        throw new BadGatewayException('Email linked to another account');
      }
    }
    const createUserWithGGDto: CreateUserWithGGDto = {
      googleId: id,
      username: email.split('@')[0],
      displayName: displayName || null,
      email: email,
      avatar: avatar,
    };
    const newUser =
      await this.usersService.createUserWithGoogle(createUserWithGGDto);
    return { _id: newUser._id };
  }
  async validateDiscordUser(profile: any): Promise<any> {
    const { id, username, avatar } = profile;
    const email = profile.email || null;
    const displayName = profile.global_name || null;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      if (existingUser && !existingUser.discordId) {
        throw new BadGatewayException('Email linked to another account');
      }
    }
    const createUserWithDiscordDto: CreateUserWithDiscordDto = {
      discordId: id,
      username: username,
      displayName: displayName,
      email: email,
      avatar: avatar,
    };
    const newUser = await this.usersService.createUserWithDiscord(
      createUserWithDiscordDto,
    );
    return { _id: newUser._id };
  }
}
