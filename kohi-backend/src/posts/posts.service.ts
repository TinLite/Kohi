import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SharePostDto } from './dto/share-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostFlags } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
  ) {}
  async create(createPostDto: CreatePostDto) {
    console.log(createPostDto);
    const data = await this.postModel.create(createPostDto);
    return {
      _id: data._id,
    };
  }
  async findAll() {
    return this.postModel
      .find({ flags: { $nin: [PostFlags.HIDDEN] } })
      .populate('author')
      .exec();
  }
  //admin
  async findAllByAuthor(author: string, limit: number, page: number) {
    const skip = (page - 1) * limit;
    const data = await this.postModel
      .find({
        author,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .populate('author')
      .exec();
    const totalPost = await this.postModel
      .countDocuments({
        author,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .exec();
    const totalPage = Math.ceil(totalPost / limit);
    return {
      data: data,
      pagination: {
        currentPage: page,
        totalElement: totalPost,
        totalPage: totalPage,
        limit: limit,
      },
    };
  }

  async findOne(id: string) {
    this.postModel.findOne({
      _id: id,
      flags: { $nin: [PostFlags.HIDDEN] },
    });
    return this.postModel.findById(id).exec();
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .findOneAndUpdate(
        {
          _id: id,
          flags: { $nin: [PostFlags.HIDDEN] },
        },
        updatePostDto,
      )
      .exec();
  }

  remove(id: string) {
    // return this.postModel.findByIdAndDelete(id).exec();
    this.postModel.findOneAndUpdate(
      {
        _id: id,
        flags: { $nin: [PostFlags.HIDDEN] },
      },
      {
        $push: {
          flags: PostFlags.HIDDEN,
        },
      },
    );
  }

  async addLike(id: string, author: string) {
    await this.postModel
      .findOneAndUpdate(
        {
          _id: id,
          flags: { $nin: [PostFlags.HIDDEN] },
        },
        {
          $push: { likes: author },
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async removeLike(id: string, author) {
    await this.postModel
      .findOneAndUpdate(
        {
          _id: id,
          flags: { $nin: [PostFlags.HIDDEN] },
        },
        {
          $pull: { likes: author },
        },
        {
          new: true,
        },
      )
      .exec();
  }
  async exists(id: string) {
    return this.postModel
      .exists({
        _id: id,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .exec();
  }
  async sharePost(
    authorId: string,
    postId: string,
    createPostDto: SharePostDto,
  ) {
    console.log(authorId, postId, createPostDto);
    const { content } = createPostDto;
    const sharedPost = await this.postModel.create({
      postShare: postId,
      author: authorId,
      content,
    });
    return {
      _id: sharedPost._id,
    };
  }
  async searchPosts(query: string) {
    const users = await this.usersService.findByName(query);
    const author = users.map((user) => user._id);
    const post = await this.postModel
      .find()
      .populate('author')
      .or([
        { content: { $regex: query, $options: 'i' } },
        { author: { $in: author } },
      ])
      .exec();
    return post;
  }
}
