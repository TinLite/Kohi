import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostFlags } from './schemas/post.schema';
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
    return this.postModel.find(
      {
        flags: { $nin: [PostFlags.HIDDEN] }
      }
    ).populate('author').exec();
  }

  async findOne(id: string) {
    this.postModel.findOne({
      _id: id,
      flags: { $nin: [PostFlags.HIDDEN] }
    })
    return this.postModel.findById(id).exec();
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findOneAndUpdate({
      _id: id,
      flags: { $nin: [PostFlags.HIDDEN] }
    }, updatePostDto).exec();
  }

  remove(id: string) {
    // return this.postModel.findByIdAndDelete(id).exec();
    this.postModel.findOneAndUpdate({
      _id: id,
      flags: { $nin: [PostFlags.HIDDEN] }
    }, {
      $push: {
        flags: PostFlags.HIDDEN
      }
    })
  }

  async addLike(id: string, author: string) {
    await this.postModel.findOneAndUpdate({
      _id: id,
      flags: { $nin: [PostFlags.HIDDEN] }
    }, {
      $push: { likes: author }
    }, {
      new: true
    }
    ).exec();
  }

  async removeLike(id: string, author) {
    await this.postModel.findOneAndUpdate({
      _id: id,
      flags: { $nin: [PostFlags.HIDDEN] }
    }, {
      $pull: { likes: author }
    }, {
      new: true
    }
    ).exec();
  }
  async exists(id: string) {
    return this.postModel.exists(
      {
        _id: id,
        flags: { $nin: [PostFlags.HIDDEN] }
      },
    ).exec();
  }
}
