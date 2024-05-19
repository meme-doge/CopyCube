import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {FilesService} from "../files/files.service";
import * as crypto from "crypto";
import * as buffer_lib from "buffer";
import {ConfigService} from "@nestjs/config";
import {Post} from "./entities/post.entity"
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../user/entities/user.entity";
import {UpdatePostDto} from "./dto/update-post.dto";
import {Category} from "./enum";

@Injectable()
export class PostService {
  constructor(
      private filesService:FilesService,
      private configService: ConfigService,
      @InjectRepository(User) private usersRepository: Repository<User>,
      @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user_id:number) {
    const {buffer, category} = createPostDto

    const fullHash = crypto.createHash('sha256').update(crypto.randomBytes(32) + buffer + Date.now()).digest("base64")
    const hash = fullHash.slice(0, 16).replace(/[+/=]/g, '');
    const params = {
      key:hash,
      buffer:buffer_lib.Buffer.from(buffer),
    }

    await this.filesService.uploadFile(params, this.configService.get('BUCKET_POSTS'))

    if (user_id){
      const post = await this.postsRepository.save({
        title: createPostDto.title,
        key:hash,
        category: category,
        user: await this.usersRepository.findOne({where:{id:user_id}})
      })
    }
    else {
      const post = await this.postsRepository.save({
        key:hash,
        title: createPostDto.title,
        category: category,
      })
    }

    return {key: hash};
  }
  async findOne(hash_id: string, user_id:number) {
    const post = await this.postsRepository.findOne({
      where: { key:hash_id },
      relations: ['user'],
    });

    if (!post){
      throw new BadRequestException('Post not found');
    }
    if (post.category === Category.Privat){
      if (post.user){
        if (post.user.id !== user_id){
          return new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }
        delete post.user.password
        delete post.user.UpdateDate
      }
    }

    const file = await this.filesService.downloadFile(hash_id, this.configService.get("BUCKET_POSTS"))

    delete post.id
    return {
      file: await file.transformToString(),
      post: post
    };
  }
  async patch(hash_id: string, updateData: UpdatePostDto, user_id:number ){
    const post = await this.postsRepository.findOne({
      where: { key:hash_id },
      relations: ['user'], // Указываем, что хотим загрузить связанные данные пользователя
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }
    if (post.user.id !== user_id){
      throw new BadRequestException('This post does not belong to you');

    }

    const params = {
        key:hash_id,
        buffer:buffer_lib.Buffer.from(updateData.buffer),
    }
    await this.filesService.uploadFile(params, this.configService.get('BUCKET_POSTS'))

    Object.assign(post, updateData);
    post.updateDate = new Date();

    await this.postsRepository.save(post);
    return new HttpException("Changes applied successfully", HttpStatus.OK)
  }
  async remove(hash_id: string, user_id: number){
    const post = await this.postsRepository.findOne({
      where: { key:hash_id },
      relations: ['user'], // Указываем, что хотим загрузить связанные данные пользователя
    });

    if (!post){
      throw new BadRequestException('Post not found');
    }
    if (post.user.id !== user_id){
      throw new BadRequestException('This post does not belong to you');
    }

    await this.filesService.removeFile(hash_id, this.configService.get('BUCKET_POSTS'))
    await this.postsRepository.remove(post)

    return new HttpException("Removal completely successful", HttpStatus.OK)
  }


  async getPublicPosts(page: number, limit: number){
    return await this.postsRepository.find({
      where:{category:Category.Public},
      skip: (page - 1) * limit,
      take: limit,
    })
  }
  async getUserPosts(user_id:number, page: number, limit: number){
    return await this.postsRepository.find({
      where:{user:{id:user_id}},
      skip: (page - 1) * limit,
      take: limit,
    })

  }
}
