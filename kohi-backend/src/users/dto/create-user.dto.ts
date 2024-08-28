export class CreateUserDto {
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
