import { IsAlphanumeric, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsAlphanumeric()
  username: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  displayName: string;

  @IsOptional()
  email: string;
  
  @IsOptional()
  sdt: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  wall: string;
}
