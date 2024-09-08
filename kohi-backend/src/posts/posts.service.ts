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

  addLike(id: string) {
    // TODO
    return `This action adds a like to a #${id} post`;
  }

  removeLike(id: string) {
    // TODO
    return `This action removes a like from a #${id} post`;
  }

  async exists(id: string) {
    return this.postModel.exists({ _id: id }).exec();
  }
}
