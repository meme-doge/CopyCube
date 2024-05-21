import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationPipe, UsePipes} from '@nestjs/common'
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RemoveUserDto} from "./dto/remove-user.dto";
import {PatchUserDto} from "./dto/patch-user.dto";
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,){}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }


  @Patch()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  changePassword(@Body() patchUserDto: PatchUserDto, @Request() req) {
    return this.userService.changePassword(patchUserDto, req.user.userId)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  delete(@Body() removeUserDto: RemoveUserDto, @Request() req) {
    return this.userService.delete(removeUserDto, req.user.userId)
  }
}
