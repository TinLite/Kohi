import { IsEmail, IsOptional, IsString } from "class-validator";
export class CreateUserWithGGDto {
    @IsString()
    googleId: string;
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