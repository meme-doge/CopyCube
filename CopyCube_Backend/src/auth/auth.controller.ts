import {Controller, Post, UseGuards, Request, Get, Patch} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
