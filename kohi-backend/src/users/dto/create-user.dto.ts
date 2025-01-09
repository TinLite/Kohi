import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  displayName: string;
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
