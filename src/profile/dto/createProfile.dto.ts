import { IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  username: string;

  description: string;

  file: string;

  @IsNotEmpty()
  user: any;

  // userId: number;
}
