import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreatePostDto } from '../dto';

@Injectable()
export class PostPipe implements PipeTransform {
  transform(value: CreatePostDto, metadata: ArgumentMetadata) {
    const profileId = Number(value.profile);

    if (isNaN(profileId)) {
      throw new HttpException(
        'profileId must be a valid number',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (profileId <= 0) {
      throw new HttpException(
        'profileId must be a positive number',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { ...value, profile: profileId };
  }
}
