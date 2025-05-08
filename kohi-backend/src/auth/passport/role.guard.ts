import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { ROLES_KEY } from '../role.decorator';

@Injectable()
export class RolesGuard extends AuthGuard() implements CanActivate {
  constructor(private reflector: Reflector, private usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.session?.user; // Ensure session and user exist
    if (!user || !user._id) {
      throw new ForbiddenException('User not authenticated');
    }

    // console.log('Required Roles:', requiredRoles);
    // console.log('User:', user);

    const userRoles = await this.usersService.getUserRoles(user._id);
    // console.log('User Roles:', userRoles);

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}