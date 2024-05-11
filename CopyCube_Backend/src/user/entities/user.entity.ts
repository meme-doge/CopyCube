import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
}
