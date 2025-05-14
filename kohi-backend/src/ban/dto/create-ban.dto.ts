import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString
} from 'class-validator';

export class CreateBanDto {
  @IsNotEmpty()
  @IsString()
  reason: string;
  @IsNotEmpty()
  types: string;
  @IsDate()
  @Type(() => Date)
  expiresAt: Date;
}
