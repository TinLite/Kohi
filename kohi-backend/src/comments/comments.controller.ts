import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create')
  async createComment(@Body() createCommentDto: CreateCommentDto,@Req() req) {
    const authorId = req.user._id;
     await this.commentsService.createComment(createCommentDto,authorId)
  }
  // Cần phải xong post mới làm đc 
  // @Delete('delete/:id')
  // async deleteComment(@Param('id') commentId: string,@Req() req) {
  //   const author = req.user._id
  //   return this.commentsService.deleteComment(commentId,author);
  // }
  
  // Update bình luận
  @Patch('update/:id')
  async updateComment(@Param('id') commentId: string,@Body() updateCommentDto: UpdateCommentDto,@Req() req) {
    const author = req.user._id
    return this.commentsService.updateComment(commentId,updateCommentDto,author);
  }
}
