import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {RemoveUserDto} from "./dto/remove-user.dto";
import {PatchUserDto} from "./dto/patch-user.dto";
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
  async delete(removeData: RemoveUserDto, user_id:number){
    const user = await this.usersRepository.findOne({where:{id:user_id}})
    if(user && await argon2.verify(user.password, removeData.password)){
      await this.usersRepository.remove(user)
      return new HttpException("Account Deleted", HttpStatus.OK)
    } throw new BadRequestException("Wrong password")
  }
  async changePassword(patchData:PatchUserDto, user_id:number){
    const user = await this.usersRepository.findOne({where:{id:user_id}})
    if(user && await argon2.verify(user.password, patchData.password)){
      if (patchData.password === patchData.passwordNew){
        throw new BadRequestException("The new password must be different from the old one")
      }
      user.UpdateDate = new Date()
      user.password = await argon2.hash(patchData.passwordNew)
      await this.usersRepository.save(user);
      return new HttpException("Password Changed", HttpStatus.OK)
    } throw new BadRequestException("Wrong password")
  }
}
