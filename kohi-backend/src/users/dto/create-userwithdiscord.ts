import { IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateUserWithDiscordDto {
  @IsString()
  discordId: string;
  @IsString()
  username: string;
  @IsString()
  displayName: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  avatar?: string;
}
