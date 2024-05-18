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
  async findOne(@Param('id') id: string, @Request() req){
    return this.postService.findOne(id, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') hash_id: string, @Body() updateData: Partial<PostEntity>, @Request() req) {
    return this.postService.patch(hash_id, updateData, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postService.remove(id, req.user.userId)
  }
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFETUlOMzMyMjIzQHJpc2V1cC5jb20iLCJzdWIiOjU1LCJpYXQiOjE3MTYwMzQ5MjksImV4cCI6MTcxODYyNjkyOX0.e74Lyn7tcl7rq8iyxC6f_uUfheJ-Vl0ZKetPcV-z_5QeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFETUlOMzMyMjIzQHJpc2V1cC5jb20iLCJzdWIiOjU1LCJpYXQiOjE3MTYwMzQ5MjksImV4cCI6MTcxODYyNjkyOX0.e74Lyn7tcl7rq8iyxC6f_uUfheJ-Vl0ZKetPcV-z_5Q