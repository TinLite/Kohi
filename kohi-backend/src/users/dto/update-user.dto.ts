import { IsAlphanumeric, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
@IsOptional() 
  @IsAlphanumeric()
  username: string;
  
  @IsOptional()
  bio:string;

  @IsOptional()
  displayName: string;

  @IsOptional()
  email: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  wall: string;

}
