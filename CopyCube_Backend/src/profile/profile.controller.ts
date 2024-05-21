import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}


  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req){
    return await this.profileService.getProfile(req.user.userId)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async patchProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto){
    return await this.profileService.patchProfile(req.user.userId, updateProfileDto)
  }
}
