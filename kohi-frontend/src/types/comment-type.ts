import { Post } from './post-type';
import { User } from "./user-type";

export class Comment {
  _id: string;
  author: User;
  content: string;
  postId: Post;
  replyTo?: string;
  timeStamp?: Date;
  likes?: string[];
  constructor(
    _id: string,
    author: User,
    content: string,
    postId: Post,
    replyTo?: string,
    timeStamp?: Date,
    likes?: string[]
  ) {
    this._id = _id;
    this.author = author;
    this.content = content;
    this.postId = postId;
    this.replyTo = replyTo;
    this.timeStamp = timeStamp;
    this.likes = likes;
  }
}
