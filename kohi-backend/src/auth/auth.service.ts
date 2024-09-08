import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../utils/utils.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private utilsService: UtilsService,
    private jwtService: JwtService) {
    this.utilsService = new UtilsService();
  }
  //validate with Guard
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user || !await this.utilsService.comparePassword(pass, user.password)) {
      return null
    }
    return user;
  }
  //login no Guard
  // async signIn(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findByEmail(username);
  //   const isCheckPass = await this.utilsService.comparePassword(pass, user.password)
  //   if (!isCheckPass) {
  //     throw new UnauthorizedException({
  //       message: 'Wrong password or Wrong username',
  //     });
  //   }
  //   const payload = { sub: user._id, username: user.email };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  // login with Guard
  async login(user: any) {
    const payload = { sub: user._id, username: user.email, roles: user.roles };
    // console.log('Login Payload:', payload);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}