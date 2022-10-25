import { MaxLength, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Profile } from 'src/interface';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  image?: string;

  @IsNotEmpty()
  profile: Profile;
}
