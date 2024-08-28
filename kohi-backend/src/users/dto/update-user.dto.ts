import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    avatar: string;
    wall: string;
    following: string[];
    bookmarks: string[];
}
