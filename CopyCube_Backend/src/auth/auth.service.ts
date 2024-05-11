import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../types/types';
const argon2 = require('argon2');


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    ) {}

  async validateUser(username:string, pass:string):Promise<any>{
    const user = await this.userService.findOne(username)
    if (user && await argon2.verify(user.password, pass)){
      const {password, ...result} = user
      return result
    }
    throw new BadRequestException("User or Password Invalid")
  }
  async login(user:IUser){
    const {name, id} = user;
    return {id, name, access_token: this.jwtService.sign({username: name, sub: id})}
  }
}
