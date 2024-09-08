import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>
  ) { }
  async create(createPostDto: CreatePostDto) {
    console.log(createPostDto);
    const data = await this.postModel.create(createPostDto);
    return {
      _id: data._id,
    }
  }

  findAll() {
    return this.postModel.find().exec();
  }

  async findOne(id: string) {
    return this.postModel.findById(id).exec();
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    console.log(id, updatePostDto);
    return this.postModel.findByIdAndUpdate(id, updatePostDto).exec();
  }

  remove(id: string) {
    // TODO: delete comments
    // TODO: soft delete?
    return this.postModel.findByIdAndDelete(id).exec();
  }

  async addLike(id: string,author: string) {
    await this.postModel.findByIdAndUpdate(id, {
      $push: { likes: author }
    }, {
      new: true
    }
    ).exec();
  }

  async removeLike(id: string, author) {
  await this.postModel.findByIdAndUpdate(id, {
    $pull: { likes: author }
  },{
    new: true
  }
  ).exec();
  }
  async exists(id: string) {
    return this.postModel.exists({ _id: id }).exec();
  }

}
