import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { Public } from 'src/auth/authmeta';
import { CheckBan } from 'src/auth/check-ban.decorator';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/auth/user.decorator';
import { EventsService } from 'src/events/events.service';
import { HidePostNotificationDto } from 'src/notifications/dto/hide-post-notification.dto';
import { LikePostNotificationDto } from 'src/notifications/dto/new-likepost-notification.dto';
import { NewPostNotificationDto } from 'src/notifications/dto/new-post-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SharePostDto } from './dto/share-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly notificationsService: NotificationsService,
  ) {}
  @CheckBan('post')
  @Post('/create')
  @UseInterceptors(FilesInterceptor('files', 15))
  async create(
    @User() request,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const requestUserId = request._id;
    if (!createPostDto.author) {
      createPostDto.author = requestUserId;
    } else if (createPostDto.author !== requestUserId) {
      throw new UnauthorizedException(
        'You are not allowed to create post for other user',
      );
    }
    const data = await this.postsService.create(createPostDto, files);
    const followers = await this.usersService.getFollowers(requestUserId);
    // console.log(followers);
    for (const followerId of followers) {
      const test = await this.notificationsService.createNotificationNewPost(
        new NewPostNotificationDto({
          userId: followerId,
          otherUser: createPostDto.author,
          post: data._id,
        }),
      );
    }
    return data;
  }
  // @Roles('admin')
  @Get('list')
  findAll() {
    return this.postsService.findAll();
  }
  @Roles('admin')
  @Get('list/admin')
  async findAllByAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('query') query?: string, // Thêm tham số query
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

    return this.postsService.findAllByAdmin(currentPage, currentLimit, query);
  }

  @Roles('admin')
  @Get('list/author/:id')
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
    return this.postsService.findAllByAuthor(id, currentPage, currentLimit);
  }

  @Public()
  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException('Post not found');
    }
    return this.postsService.findOne(id);
  }
  @CheckBan('post')
  @Patch('detail/:id/update')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() request,
  ) {
    const requestUserId = request._id;
    const post = await this.postsService.findOne(id);
    console.log(post.author, requestUserId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // @ts-expect-error
    if (post.author._id.toString() !== requestUserId) {
      throw new UnauthorizedException(
        'You are not allowed to update this post',
      );
    }
    return this.postsService.update(id, updatePostDto);
  }

  @Delete('detail/:id/delete')
  async remove(@Param('id') id: string, @User() request) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException('Post not found');
    }
    const requestUserId = request._id;
    const post = await this.postsService.findOne(id);
    console.log(post.author, requestUserId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // @ts-expect-error
    if (post.author._id.toString() !== requestUserId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this post',
      );
    }
    await this.notificationsService.deleteAllNotificationByPostId(id);
    return this.postsService.deletePost(id);
  }

  @Post('detail/:id/like')
  async addLike(@Param('id') id: string, @User() request) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const requestUserId = request._id;
    if (post.likes.includes(requestUserId)) {
      throw new BadGatewayException('You already liked this post');
    }
    const postNoPopulate = await this.postsService.findOneNoPopulate(id);
    const authorId = postNoPopulate.author;
    await this.postsService.addLike(id, requestUserId);
    if (requestUserId !== authorId.toString()) {
      await this.notificationsService.createNotificationNewLikePost(
        new LikePostNotificationDto({
          userId: authorId,
          otherUser: requestUserId,
          post: id,
        }),
      );
    }
    return {
      message: 'Post liked successfully',
    };
  }

  @Delete('detail/:id/unlike')
  async removeLike(@Param('id') id: string, @User() request) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const requestUserId = request._id;
    if (!post.likes.includes(requestUserId)) {
      throw new BadGatewayException('You have not liked this post yet');
    }
    const Notification =
      await this.notificationsService.findOneLikePostNotification(
        post.author,
        id,
      );
    console.log(Notification);
    if (Notification) {
      await this.notificationsService.deleteNotification(Notification._id);
    }
    await this.postsService.removeLike(id, requestUserId);
    return {
      message: 'Post unliked successfully',
    };
  }

  @Post('detail/:postId/share')
  async sharePost(
    @User() request,
    @Param('postId') postId: string,
    @Body() sharePostDto: SharePostDto,
  ) {
    const post = await this.postsService.findOne(postId);
    const authorId = request._id;
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const shareTarget = post.postShare ?? postId;
    return this.postsService.sharePost(
      authorId,
      shareTarget as string,
      sharePostDto,
    );
  }

  @Delete('detail/:postId/unshare')
  async unsharePost(@User() request, @Param('postId') postId: string) {
    const post = await this.postsService.findOne(postId);
    const authorId = request._id;
    // console.log(authorId, post.author);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (!post.postShare) {
      throw new NotFoundException('Post not shared');
    }
    // @ts-expect-error
    if (post.author._id.toString() !== authorId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this post',
      );
    }
    return this.postsService.deletePostShare(postId);
  }

  @Patch('detail/:postId/updateshare')
  async updatePostShare(
    @Param('postId') postId: string,
    @Body() updatePostShareDto: SharePostDto,
    @User() request,
  ) {
    const post = await this.postsService.findOne(postId);
    console.log(postId, updatePostShareDto);
    const author = request._id;
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // if(!post.postShare) {
    //   throw new NotFoundException('Post not shared');
    // }
    // @ts-expect-error
    if (post.author._id.toString() !== author) {
      throw new UnauthorizedException(
        'You are not allowed to update this post',
      );
    }
    return this.postsService.updatePostShare(postId, updatePostShareDto);
  }
  @Get('search')
  async search(@Query('q') q: string) {
    const post = await this.postsService.searchPosts(q);
    console.log(post);
    return post;
  }
  @Get(':id/likes')
  async countLikes(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.postsService.countLikes(id);
  }
  @Get('profile/list/:id?')
  async getProfilePosts(@User() request, @Param('id') id?: string) {
    const requestUserId = id ?? request._id;
    if (!requestUserId) {
      throw new NotFoundException('User not found');
    }
    return this.postsService.getProfilePosts(requestUserId);
  }
  @Get('profile/media/:id?')
  async getProfileMedia(@User() request, @Param('id') id?: string) {
    const requestUserId = id ?? request._id;
    if (!requestUserId) {
      throw new NotFoundException('User not found');
    }
    return this.postsService.getProfileMedia(requestUserId);
  }
  @Get('profile/share/:id?')
  async getProfileShares(@User() request, @Param('id') id?: string) {
    const requestUserId = id ?? request._id;
    if (!requestUserId) {
      throw new NotFoundException('User not found');
    }
    return this.postsService.getProfileShares(requestUserId);
  }
  @Roles('admin')
  @Post('hide/:id')
  async hidePost(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.postsService.hidePost(id);
    return await this.notificationsService.createNotificationHidePost(
      new HidePostNotificationDto({
        //@ts-expect-error
        userId: post.author._id,
        post: id,
      }),
    );
  }
  @Roles('admin')
  @Post('unhide/:id')
  async unhidePost(@Param('id') id: string) {
    const post = await this.postsService.findOneToUnhide(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const notification =
      await this.notificationsService.findOneHidePostNotification(
        //@ts-expect-error
        post.author._id,
        id,
      );
    if (notification) {
      await this.notificationsService.deleteNotification(notification._id);
    }
    return this.postsService.unhidePost(id);
  }
  @Roles('admin')
  @Get('/admin/detail/:id')
  async findOneByAdmin(@Param('id') id: string) {
    if (!id) {
      throw new NotFoundException('Post not found');
    }
    return this.postsService.getOnePostByAdmin(id);
  }
}
