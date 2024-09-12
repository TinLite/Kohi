import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  NotFoundException,
  UnauthorizedException,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import mongoose from 'mongoose';
import { Public } from 'src/auth/authmeta';
import { Role } from 'src/users/schemas/user.schema';
import { Roles } from 'src/auth/role.decorator';


@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) { }

  @Post('create')
  async create(@Request() request, @Body() createPostDto: CreatePostDto) {
    const requestUserId = request.user._id;
    if (!createPostDto.author) {
      createPostDto.author = requestUserId;
    } else if (createPostDto.author !== requestUserId) {
      // TODO check if user is admin
      throw new UnauthorizedException(
        'You are not allowed to create post for other user',
      );
    }
    return await this.postsService.create(createPostDto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.postsService.findAll();
  }
  
  @Roles(Role.ADMIN)
  @Get('list/:id')
  findAllByAuthor(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new BadRequestException('Malfunctioned page or limit');
    }
    return this.postsService.findAllByAuthor(id,currentPage,currentLimit);
  }

  @Get('detail/:id')
  @Public()
  findOne(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException('Post not found');
    }
    return this.postsService.findOne(id);
  }

  @Patch('detail/:id/update')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() request,
  ) {
    const requestUserId = request.user._id;
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.author.toString() !== requestUserId) {
      throw new UnauthorizedException(
        'You are not allowed to update this post',
      );
    }
    return this.postsService.update(id, updatePostDto);
  }

  @Delete('detail/:id/delete')
  async remove(@Param('id') id: string, @Request() request) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException('Post not found');
    }
    const requestUserId = request.user._id;
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // TODO Add admin role check
    if (post.author.toString() !== requestUserId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this post',
      );
    }
    this.postsService.remove(id);
  }

  @Post('detail/:id/like')
  async addLike(@Param('id') id: string, @Request() request) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const requestUserId = request.user._id;
    if (post.likes.includes(requestUserId)) {
      throw new UnauthorizedException('You already liked this post');
    }
    return this.postsService.addLike(id, requestUserId);
  }

  @Delete('detail/:id/unlike')
  async removeLike(@Param('id') id: string, @Request() request) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const requestUserId = request.user._id;
    if (!post.likes.includes(requestUserId)) {
      throw new UnauthorizedException('You have not liked this post yet');
    }
    return this.postsService.removeLike(id, requestUserId);
  }

  @Post('detail/:postId/share')
  async sharePost(
    @Request() request,
    @Param('postId') postId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    const post = await this.postsService.findOne(postId);
    const authorId = request.user._id;
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const shareTarget = post.postShare ?? postId;
    return this.postsService.sharePost(
      authorId,
      shareTarget as string,
      createPostDto,
    );
  }

}
