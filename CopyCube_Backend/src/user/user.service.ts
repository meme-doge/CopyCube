import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
const argon2 = require('argon2');
@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User) private usersRepository: Repository<User>,
      private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersRepository.findOne({
      where:{
        name: createUserDto.name
      }
    })
    if (existUser) throw new BadRequestException("this name already exist")

    const user = await this.usersRepository.save({
      name: createUserDto.name,
      password: await argon2.hash(createUserDto.password)
    })
    const token = this.jwtService.sign({
      username:createUserDto.name,
      sub:user.id
    })

    delete user.password
    return {user, token}
  }
  async findOne(name:string){
    return await this.usersRepository.findOne({where:{name}})
  }
}
