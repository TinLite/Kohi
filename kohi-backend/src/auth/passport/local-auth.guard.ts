import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BanService } from 'src/ban/ban.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly banService: BanService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }
    const banRecord = await this.banService.findActiveBan(user._id, 'account');
    if (banRecord) {
      if (banRecord.expiresAt <= new Date()) {
        await this.banService.autoUnban(
          user._id,
          'account',
          'Ban expired',
        );
        return true;
      }
      throw new ForbiddenException(
        `Your account is banned. Reason: ${banRecord.reason}`,
      );
    }

    return true;
  }
}
