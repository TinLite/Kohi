import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SharePostDto } from './dto/share-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostFlags } from './schemas/post.schema';
import { UtilsService } from '../utils/utils.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
    private readonly utilsService: UtilsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(createPostDto: CreatePostDto, files?: Express.Multer.File[]) {
    if (files && files.length > 0) {
      // const folder = process.env.CLOUDINARY_FOLDER_POST;
      const uploadImages = await this.cloudinaryService.uploadFiles(
        files,
        // folder,
      );
      createPostDto.media = uploadImages;
    }
    console.log(files);
    // console.log(createPostDto);
    const data = await this.postModel.create(createPostDto);
    return {
      _id: data._id,
    };
  }
  async findAll() {
    return this.postModel
      .find({ flags: { $nin: [PostFlags.HIDDEN] } })
      .populate('author')
      .populate({
        path: 'postShare',
        select: 'content author',
      })
      .populate({
        path: 'postShare',
        populate: {
          path: 'author',
          select: 'username displayname avatar',
        },
      })
      .sort({ createdAt: -1 })
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
    return this.postModel
      .findOne({
        _id: id,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .populate({
        path: 'author',
        select: 'username displayname avatar',
      })
      .populate({
        path: 'postShare',
        populate: {
          path: 'author',
          select: 'username displayname avatar',
        },
      })
      .exec();
  }
  async findOneNoPopulate(id: string) {
    return this.postModel
      .findOne({
        _id: id,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .exec();
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
  hidePost(id: string) {
    return this.postModel.findOneAndUpdate(
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
  async deletePost(id: string) {
    return this.postModel.findOneAndDelete({
      _id: id,
      flags: { $nin: [PostFlags.HIDDEN] },
    });
  }
  async addLike(id: string, author: string) {
    return await this.postModel.findOneAndUpdate(
      {
        _id: id,
        flags: { $nin: [PostFlags.HIDDEN] },
      },
      {
        $push: { likes: author },
      },
    );
  }

  async removeLike(id: string, author) {
    return this.postModel.findOneAndUpdate(
      {
        _id: id,
        flags: { $nin: [PostFlags.HIDDEN] },
      },
      {
        $pull: { likes: author },
      },
      // {
      //   new: true,
      // },
    );
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
    // console.log(authorId, postId, createPostDto);
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

  async deletePostShare(postId: string) {
    await this.postModel.deleteOne({ _id: postId });
  }

  async updatePostShare(postId: string, updatePostDto: SharePostDto) {
    const { content } = updatePostDto;
    const sharedPost = await this.postModel.findOneAndUpdate(
      { _id: postId, flags: { $nin: [PostFlags.HIDDEN] } },
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      },
    );
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
      .populate({
        path: 'postShare',
        populate: {
          path: 'author',
          select: 'username displayname avatar',
        },
      })
      .or([
        { content: { $regex: query, $options: 'i' } },
        {
          $and: [
            { content: { $not: { $regex: query, $options: 'i' } } },
            { author: { $in: author } },
          ],
        },
      ])
      .exec();
    return post;
  }

  async searchBookMark(query: string) {
    const users = await this.usersService.findByNameOrDisplayName(query);
    const authorIds = users.map((user) => user._id);
    const posts = await this.postModel
      .find()
      .populate('author')
      .populate({
        path: 'postShare',
        populate: {
          path: 'author',
          select: 'username displayname avatar',
        },
      })
      .or([
        { content: { $regex: query, $options: 'i' } },
        { author: { $in: authorIds } },
      ])
      .exec();

    return posts;
  }

  async countLikes(id: string) {
    const post = await this.postModel
      .findOne({
        _id: id,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .populate('likes')
      .lean()
      .exec();
    const totalLike = post.likes.length;
    const formattedLike = await this.utilsService.formatLikeCount(totalLike);
    return {
      total: formattedLike,
      userLiked: post.likes,
    };
  }
  async getProfilePosts(author: string) {
    return await this.postModel
      .find({
        author,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .populate({
        path: 'author',
        select: 'username displayname avatar',
      })
      .populate({
        path: 'postShare',
        populate: {
          path: 'author',
          select: 'username displayname avatar',
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }
  async getProfileMedia(author: string) {
    const posts = await this.postModel
      .find({
        author,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .select('media')
      .exec();
    const media = posts.reduce((acc, post) => {
      return acc.concat(post.media);
    }, []);
    return media;
  }

  async findPosts(filter: any) {
    return this.postModel
      .find(filter)
      .populate('author', 'username displayname')
      .populate({
        path: 'postShare',
        populate: {
          path: 'author',
          select: 'username displayname avatar',
        },
      })
      .exec();
  }
  async getProfileShares(author: string) {
    return this.postModel
      .find({
        postShare: { $exists: true },
        author,
        flags: { $nin: [PostFlags.HIDDEN] },
      })
      .populate('author')
      .populate({
        path: 'postShare',
        select: 'content author',
      })
      .populate({
        path: 'postShare',
        populate: {
          path: 'author',
          select: 'username displayname avatar',
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
