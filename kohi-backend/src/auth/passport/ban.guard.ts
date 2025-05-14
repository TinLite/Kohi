import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BanService } from 'src/ban/ban.service';

@Injectable()
export class CheckBanGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly banService: BanService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.session?.user;
    if (!user || !user._id) {
      return true;
    }
    const actionType = this.reflector.get<string>(
      'banType',
      context.getHandler(),
    );
    if (!actionType) {
      return true;
    }
    const banRecord = await this.banService.findActiveBan(user._id, actionType);
    if (banRecord) {
      if (banRecord.expiresAt <= new Date()) {
        await this.banService.autoUnban(
          user._id,
          actionType,
          'ban expired',
        );
        return true;
      }
      throw new ForbiddenException(
        `You are banned from performing this action. Reason: ${banRecord.reason}`,
      );
    }

    return true;
  }
}
