import { User } from "./user-type";

export class Post {
  _id: string;
  author: User;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: String[];
  constructor(
    _id: string,
    title: string,
    content: string,
    author: User,
    createdAt: Date,
    updatedAt: Date,
    likes?: String[]
  ) {
    this._id = _id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.likes = likes;
  }
}
