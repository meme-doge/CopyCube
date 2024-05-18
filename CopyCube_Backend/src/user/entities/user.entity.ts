import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import { Post } from "../../post/entities/post.entity"
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id:number

  @Column()
  name:string

  @Column()
  password:string

  @CreateDateColumn()
  CreateDate:Date

  @UpdateDateColumn()
  UpdateDate:Date

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]
}
