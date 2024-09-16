import { IsOptional, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class SharePostDto {
    @IsOptional()
  @IsString()
  content: string;

}
