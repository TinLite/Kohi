import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostFlags } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo } from 'mongoose';
import { throws } from 'assert';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    console.log(createPostDto);
    const data = await this.postModel.create(createPostDto);
    return {
      _id: data._id,
    };
  }
  async findAll() {
    return this.postModel.find({ flags: { $nin: [PostFlags.HIDDEN] } }).populate('author').exec();
  }
  //admin
  async findAllByAuthor(
    author: string,
    limit: number,
    page: number,
  ){
    const skip = (page - 1) * limit;
    const data = await this.postModel.find({
      author,
      flags: { $nin: [PostFlags.HIDDEN] }
    }).populate('author').exec();
    const totalPost = await this.postModel.countDocuments({
      author,
      flags: { $nin: [PostFlags.HIDDEN] }
    }).exec();
    const totalPage = Math.ceil(totalPost / limit);
    return {
      data: data,
      pagination: {
        currentPage: page,
        totalElement: totalPost,
        totalPage: totalPage,
        limit: limit
      }
    }
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
  async sharePost(
    authorId: string,
    postId: string,
    createPostDto: CreatePostDto,
  ) {
    const { author, content, postShare } = createPostDto;
    const sharedPost = await this.postModel.create({
      postShare: postId,
      author: authorId,
      content,
    });
    return {
      _id: sharedPost._id,
    };
  }
  
}
