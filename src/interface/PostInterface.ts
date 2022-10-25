import { Profile } from './';

export interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  profile: Profile;
}
