import { Optional } from '@nestjs/common';
export class CreateBanDto {
  @Optional()
  reason: string;
  @Optional()
  expiresAt: Date;
  @Optional()
  unbanReason: string;
}
