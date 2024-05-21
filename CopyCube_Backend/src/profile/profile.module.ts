import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {InjectRepository, TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {FilesModule} from "../files/files.module";
import {PostService} from "../post/post.service";
import {FilesService} from "../files/files.service";
import {ConfigService} from "@nestjs/config";

@Module({
  imports:[
      FilesModule,
      TypeOrmModule.forFeature([User]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, FilesService, ConfigService],
})
export class ProfileModule {}
