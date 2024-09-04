//mỗi 1 lần gửi request sẽ gửi kèm token lấy header toker r đem đi validate
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  //giải mã token
  async validate(payload: any) {
    console.log('Payload:', payload);
    return { _id: payload.sub, username: payload.username,roles:payload.roles };
  }
}