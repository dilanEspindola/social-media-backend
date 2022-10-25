import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/services/users/users.service';
import { verifyToken } from 'src/utils';
import { JwtPayload } from 'jsonwebtoken';

interface JwtPayloadResponse extends JwtPayload {
  id?: number;
  email?: string;
}

@Injectable()
export class PostMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async validateToken(req: Request, res: Response, next: () => void) {
    try {
      const { authorization, 'public-key-pins': publicKey } = req.headers;

      if (!publicKey || !authorization) {
        throw new Error('NO_TOKEN_OR_PUBLIC_KEY_PROVIDED');
      }

      const getToken = (await verifyToken(
        authorization,
        publicKey,
      )) as JwtPayloadResponse;
      if (typeof getToken === 'string') {
        throw new Error('TOKEN_OR_KEY_ARE_NOT_VALID');
      }

      const user = await this.userService.getUserById(getToken.id);

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      return next();
    } catch (error) {
      switch (error.message) {
        case 'NO_TOKEN_OR_PUBLIC_KEY_PROVIDED':
          throw new HttpException(
            'NO_TOKEN_OR_PUBLIC_KEY_PROVIDED',
            HttpStatus.UNAUTHORIZED,
          );
        case 'invalid token':
          throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
        case 'USER_NOT_FOUND':
          throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        case 'TOKEN_OR_KEY_ARE_NOT_VALID':
          throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        case `Cannot read properties of undefined (reading 'id')`:
          throw new HttpException(
            'VALUES_ARE_NOT_VALID',
            HttpStatus.UNAUTHORIZED,
          );
        default:
          throw new HttpException(
            'INTERNAL_SERVER_ERROR',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  async use(req: Request, res: Response, next: () => void) {
    await this.validateToken(req, res, next);
  }
}
