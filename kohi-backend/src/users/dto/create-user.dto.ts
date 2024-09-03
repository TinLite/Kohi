import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    avatar: string;
    wall: string;
    following: string[];
    bookmarks: string[];
}
