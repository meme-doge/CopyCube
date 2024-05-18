import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { FilesService } from "../files/files.service";
import { FilesModule } from "../files/files.module";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Post } from "../post/entities/post.entity"

@Module({
  imports:[
      FilesModule,
      TypeOrmModule.forFeature([User]),
      TypeOrmModule.forFeature([Post]),
  ],
  controllers: [PostController],
  providers: [PostService, FilesService, ConfigService],
})
export class PostModule {}
