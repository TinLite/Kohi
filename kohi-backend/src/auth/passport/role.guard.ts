import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { ROLES_KEY } from '../role.decorator';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector, private usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Nếu không yêu cầu role, cho phép truy cập
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user._id) {
      throw new ForbiddenException('User not authenticated'); // Người dùng chưa xác thực
    }

    const userRoles = await this.usersService.getUserRoles(user._id);

    // Kiểm tra nếu bất kỳ role nào của người dùng trùng với yêu cầu
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      console.log('User Roles:', userRoles);
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}