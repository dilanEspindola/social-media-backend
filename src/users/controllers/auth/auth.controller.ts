import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from '../../dto';
import { AuthService } from '../../services/auth/auth.service';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async getUser(
    @Body(ValidationPipe) userData: LoginDto,
    @Res() res: Response,
  ) {
    try {
      const { user, message, publicKey, token } =
        await this.authService.findUser(userData);

      if (message === 'email and/or password are not valid')
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ auth: false, message });

      const { privateKey, password, ...rest } = user;
      const restUser = rest;
      return res.status(HttpStatus.OK).json({
        auth: true,
        user: restUser,
        token,
        publicKey,
      });
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
