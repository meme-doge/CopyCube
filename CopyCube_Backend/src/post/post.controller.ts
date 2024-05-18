import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe, Patch, Delete
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post as PostEntity } from "./entities/post.entity"

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string){
    return this.postService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') hash_id: string, @Body() updateData: Partial<PostEntity>, @Request() req) {
    return this.postService.patch(hash_id, updateData, req.user.userId)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postService.remove(id, req.user.userId)
  }
}
