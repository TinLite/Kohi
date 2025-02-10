import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private utilsService: UtilsService,
  ) {
    this.utilsService = new UtilsService();
  }
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(username);
    if (
      !user ||
      !(await this.utilsService.comparePassword(pass, user.password))
    ) {
      return null;
    }
    return {
      _id: user._id,
      // username: user.username,
      // displayname: user.displayName,
      // role: user.roles,
    };
  }
}
