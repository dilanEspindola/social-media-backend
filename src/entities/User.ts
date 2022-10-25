import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Profile } from './';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 120 })
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'text' })
  privateKey: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
