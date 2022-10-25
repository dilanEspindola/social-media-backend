import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateProfileDto } from '../dto';

@Injectable()
export class ProfilePipe implements PipeTransform {
  transform(value: CreateProfileDto, metadata: ArgumentMetadata) {
    const userIdParsed = Number(value.user);

    if (isNaN(value.user)) {
      throw new HttpException(
        'userId must be a number',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { ...value, user: userIdParsed };
  }
}
