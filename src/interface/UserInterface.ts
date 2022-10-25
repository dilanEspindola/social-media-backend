import { Post } from './PostInterface';
import { Profile } from './ProfileInterface';

export interface User {
  id: number;
  fullname: string;
  email: string;
  password?: string;
  profile?: Profile;
  posts?: Post;
  privateKey: string;
}

export type Login = Pick<User, 'email' | 'password'>;
