import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Category} from "../enum";
import { User } from "../../user/entities/user.entity"

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    key:string

    @Column()
    category:Category

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({name:'user_id'})
    user: User

    @CreateDateColumn()
    createDate:Date

    @UpdateDateColumn()
    updateDate:Date


}
