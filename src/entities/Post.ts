import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column('text', { nullable: true })
  image: string;

  @ManyToOne(() => Profile, (profile) => profile.posts, {
    cascade: ['insert', 'remove', 'update'],
    onDelete: 'CASCADE',
  })
  profile: Profile;
}
