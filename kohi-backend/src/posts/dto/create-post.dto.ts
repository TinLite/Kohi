import { IsOptional, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class CreatePostDto {
  @IsOptional()
  author: Schema.Types.ObjectId;

  @IsString()
  content: string;

  @IsOptional()
  postShare: Schema.Types.ObjectId;
}
