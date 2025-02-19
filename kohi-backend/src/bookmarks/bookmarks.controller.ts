import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { BookmarkService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { UsersService } from 'src/users/users.service';
import { PostsService } from 'src/posts/posts.service';
import mongoose, { mongo } from 'mongoose';
import { retry } from 'rxjs';
import { User } from 'src/auth/user.decorator';

@Controller('users/')
export class BookmarksController {
  constructor(
    private readonly bookmarksService: BookmarkService,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}
  //add bookmark
  @Post('profile/bookmark/add/:id')
  async addBookmark(@Param('id') postId: string, @User() req) {
    const author = req._id;
    const user = await this.usersService.findOne(author);
    const post = await this.postsService.findOne(postId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (user.bookmarks.includes(post)) {
      throw new NotFoundException('Post already bookmarked');
    }
    const added = this.bookmarksService.addBookMark(author, postId);
    return {
      message: 'Bookmark added',
    };
  }

  @Delete('profile/bookmark/remove/:id')
  async removeBookmark(@Param('id') postId: string, @User() req) {
    const author = req._id;
    const user = await this.usersService.findOne(author);
    // @ts-ignore
    if (!user.bookmarks.includes(postId)) {
      throw new NotFoundException('Post not bookmarked');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const deleted = this.bookmarksService.removeBookMark(author, postId);
    return {
      message: 'Bookmark removed',
    };
  }

  @Get('profile/bookmark')
  async listBookMark(
    @User() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const author = req._id;
    const user = await this.usersService.findOne(author);
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(currentLimit) ||
      currentPage <= 0 ||
      currentLimit <= 0
    ) {
      throw new NotFoundException('Page or limit not found');
    }
    return this.bookmarksService.listBookMark(
      author,
      currentPage,
      currentLimit,
    );
  }
  @Get('profile/bookmarks/search')
  async searchBookMark(@Query('query') query: string, @User() req) {
    const author = req._id;
    const user = await this.usersService.findOne(author);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const data = await this.bookmarksService.searchBookMark(query, author);
    console.log(data);
    return data;
  }
}
