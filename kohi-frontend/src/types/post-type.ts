import { User } from "./user-type";
export enum PostFlags {
  HIDDEN = 'hidden',
}

export class Post {
  _id: string;
  author: User;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  media: string[];
  likes?: String[];
  postShare?: Post;
  flags?: PostFlags[];
  constructor(
    _id: string,
    title: string,
    content: string,
    author: User,
    createdAt: Date,
    updatedAt: Date,
    media: string[],
    likes?: String[],
    postShare?: Post,
    flags?: PostFlags[]
  ) {
    this._id = _id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.media = media;
    this.likes = likes;
    this.postShare = postShare;
    this.flags = flags;
  }
}
