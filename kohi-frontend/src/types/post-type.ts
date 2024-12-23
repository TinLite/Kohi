import { User } from "./user-type";

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
  constructor(
    _id: string,
    title: string,
    content: string,
    author: User,
    createdAt: Date,
    updatedAt: Date,
    media: string[],
    likes?: String[],
    postShare?: Post
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
  }
}
