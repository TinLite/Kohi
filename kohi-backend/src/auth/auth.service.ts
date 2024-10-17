import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private utilsService: UtilsService,
    private jwtService: JwtService,
  ) {
    this.utilsService = new UtilsService();
  }
  //validate with Guard
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(username);
    if (
      !user ||
      !(await this.utilsService.comparePassword(pass, user.password))
    ) {
      return null;
    }
    return user;
  }
  // login with Guard
  async login(user: any) {
    const payload = { sub: user._id, username: user.email, roles: user.roles };
    // console.log('Login Payload:', payload);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  decodeToken(token: string) {
    return this.jwtService.verify(token);
  }
}
