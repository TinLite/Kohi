import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { UsersService } from "./users.service";
import { PostsService } from '../posts/posts.service';
import { Post } from "src/posts/schemas/post.schema";

@Injectable()
export class BookmarkService{
    constructor( @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService
  ) {}
  //add bookmark
  
}