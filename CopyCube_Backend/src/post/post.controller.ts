import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  UsePipes,
  ValidationPipe, Patch, Delete, All
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post as PostEntity } from "./entities/post.entity"
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get("user")
  getUserPosts(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 10){
    console.log(req.user.id, page, limit)
    return this.postService.getUserPosts(req.user.id, page, limit);
  }
  @Get("public")
  getPublicPosts(@Query('page') page: number = 1, @Query('limit') limit: number = 10){
    return this.postService.getPublicPosts(page, limit);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    if (!req.user){
      return this.postService.create(createPostDto, req.user);
    }
    return this.postService.create(createPostDto, req.user.userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne( @Request() req, @Param('id') id: string){
    if (!req.user){
      return this.postService.findOne(id, req.user)
    }
    return this.postService.findOne(id, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Request() req, @Param('id') hash_id: string, @Body() updateData: Partial<PostEntity>) {
    return this.postService.patch(hash_id, updateData, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.postService.remove(id, req.user.userId)
  }
}