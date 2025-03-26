import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../authmeta';
import { AuthGuard } from '@nestjs/passport';
import session from 'express-session';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(protected reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Kiểm tra nếu route là public không cần bảo vệ
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // Kiểm tra tồn tại session
    const request = context.switchToHttp().getRequest();
    if (!request.session.user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
