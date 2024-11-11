import { Comment } from "./comment-type";
import { Post } from "./post-type";
import { User } from "./user-type";

export class Notification {
    _id: string;
    type: string;
    userId: User;
    post?: Post;
    otherUser?: User;
    comment?: Comment;
    isRead: boolean;
    createAt: Date;
    constructor(_id: string,type: string, userId: User,post:Post,otherUser: User,comment:Comment,isRead: boolean , createAt: Date) {
        this._id = _id;
        this.type = type;
        this.userId = userId;
        this.post = post;
        this.otherUser = otherUser;
        this.comment = comment;
        this.isRead = isRead;
        this.createAt = createAt;
    }
}