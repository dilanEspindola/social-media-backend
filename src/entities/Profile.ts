import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User, Post } from './';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  description: string;

  @Column('text')
  file: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Post, (post) => post.profile)
  posts: Post[];
}
