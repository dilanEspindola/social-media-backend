import { User } from './';

export interface Profile {
  id: number;
  username: string;
  description: string;
  file: string;
  user: User;
}
