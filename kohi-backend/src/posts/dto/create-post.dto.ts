import { IsOptional, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class CreatePostDto {
  @IsOptional()
  author: Schema.Types.ObjectId;
  @IsOptional()
  content: string;
  @IsOptional()
  postShare: Schema.Types.ObjectId;
  @IsOptional()
  media:string[];
}
