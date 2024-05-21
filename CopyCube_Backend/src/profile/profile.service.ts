import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {FilesService} from "../files/files.service";
import {ConfigService} from "@nestjs/config";
import * as crypto from "crypto";
import * as buffer_lib from "buffer";

@Injectable()
export class ProfileService {
  constructor(
      private filesService:FilesService,
      private configService: ConfigService,
      @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getProfile(user_id: number){
    const {password, id, posts,  ...result} = await this.usersRepository.findOne({where:{id:user_id}})
    return result
  }
  async patchProfile(user_id: number, updateData:UpdateProfileDto){
    const user = await this.usersRepository.findOne({where:{id:user_id}})

    if (updateData.avatar){
      const avatar = updateData.avatar

      const fullHash = crypto.createHash('sha256').update(crypto.randomBytes(32) + avatar + Date.now()).digest("base64")
      const hash = fullHash.slice(0, 32).replace(/[+/=]/g, '');

      const params = {
        key:hash,
        buffer:buffer_lib.Buffer.from(avatar, "base64"),
      }
      await this.filesService.uploadFile(params, this.configService.get('BUCKET_AVATARS'))
      if(user.avatar){
        await this.filesService.removeFile(user.avatar, this.configService.get('BUCKET_AVATARS'))
      }
      user.avatar = hash

      await this.usersRepository.save(user)
      return new HttpException("All changes applied", HttpStatus.OK)
    }
  }
}
