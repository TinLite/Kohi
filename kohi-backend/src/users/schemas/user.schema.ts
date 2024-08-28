import { Prop } from "@nestjs/mongoose";

export class User {
    @Prop()
    username: string;
    
    @Prop()
    password: string;

    @Prop()
    email: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    avatar: string;

    @Prop()
    wall: string;

    @Prop()
    following: string[];

    @Prop()
    bookmarks: string[];

}
