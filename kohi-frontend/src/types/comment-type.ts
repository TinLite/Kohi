import { Post } from './post-type';
import { User } from "./user-type";
export enum CommentFlags {
  HIDDEN = 'hidden',
}

export class Comment {
  _id: string;
  author: User;
  content: string;
  postId: Post;
  replyTo?: string;
  timeStamp?: Date;
  likes?: string[];
  flags?: CommentFlags[];
  constructor(
    _id: string,
    author: User,
    content: string,
    postId: Post,
    replyTo?: string,
    timeStamp?: Date,
    likes?: string[],
    flags?: CommentFlags[]
  ) {
    this._id = _id;
    this.author = author;
    this.content = content;
    this.postId = postId;
    this.replyTo = replyTo;
    this.timeStamp = timeStamp;
    this.likes = likes;
    this.flags = flags;
  }
}
