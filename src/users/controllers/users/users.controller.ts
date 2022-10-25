import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../../services/users/users.service';
import { EncryptPassword } from '../../../utils';
import { User } from '../../../interface';
import { CreateUserDto } from '../../dto';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private hashPassword: EncryptPassword,
  ) {}

  @Get()
  async getUsers(): Promise<Array<User> | []> {
    try {
      const users = await this.userService.findUsers();
      if (users.length < 1) return [];
      return users;
    } catch (error) {
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'user not found',
          statusCode: HttpStatus.NOT_FOUND,
        });

      return res
        .status(HttpStatus.OK)
        .json({ user, statusCode: HttpStatus.OK });
    } catch (error) {
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body(ValidationPipe) userData: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const passHashed = await this.hashPassword.hashPassword(
        userData.password,
      );
      const user = { ...userData, password: passHashed };
      const userMsg = await this.userService.createUser(user);

      return res
        .status(HttpStatus.OK)
        .json({ message: userMsg, statusCode: HttpStatus.OK });
    } catch (error) {
      console.log(error.message);

      if (error.message.includes(userData.email))
        throw new HttpException(
          'email already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const userMsg = await this.userService.deleteUser(userId);
      return res
        .status(HttpStatus.OK)
        .json({ message: userMsg, statusCode: HttpStatus.OK });
    } catch (error) {
      if (error.message.includes('null'))
        throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async deleteAllUsers() {
    try {
      await this.userService.deleteAllUsers();
      return { message: 'users deleted' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
