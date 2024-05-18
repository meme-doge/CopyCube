import {Injectable} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {FilesService} from "../files/files.service";
import * as crypto from "crypto";
import * as buffer_lib from "buffer";
import {ConfigService} from "@nestjs/config";
import {Post} from "../post/entities/post.entity"
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../user/entities/user.entity";

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

    const fullHash = crypto.createHash('sha256').update(crypto.randomBytes(32) + buffer + Date.now() + user_id).digest("base64")
    const hash = fullHash.slice(0, 16).replace(/[+/=]/g, '');

    const params = {
      key:hash,
      buffer:buffer_lib.Buffer.from(buffer),
    }

    await this.filesService.uploadFile(params, this.configService.get('BUCKET_POSTS'))

    const post = await this.postsRepository.save({
      key:hash,
      category: category,
      user: await this.usersRepository.findOne({where:{id:user_id}})
    })

    return {key: hash};
  }
  async findOne(id: string) {
    const file = await this.filesService.downloadFile(id, this.configService.get("BUCKET_POSTS"))

    return await file.transformToString();
  }
}
