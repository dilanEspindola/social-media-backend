import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { LoginDto } from 'src/users/dto';
import { EncryptPassword, generateToken } from 'src/utils';
import { User as UserInterface } from 'src/interface';

interface AuthServiceResponse {
  user?: UserInterface;
  token?: string;
  publicKey?: string;
  message?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private encryptPasswrd: EncryptPassword,
  ) {}

  async findUser(userData: LoginDto): Promise<AuthServiceResponse> {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
      relations: { profile: { posts: true } },
    });

    const message = 'email and/or password are not valid';
    if (!user) return { message };

    const comparePassword = await this.encryptPasswrd.comparePassword(
      userData.password,
      user.password,
    );
    if (!comparePassword) return { message };

    const { privateKey, publicKey, token } = generateToken<{
      id: number;
      email: string;
    }>({
      id: user.id,
      email: user.email,
    });

    const userUpdatedWithToken = await this.updateUserToken(
      privateKey,
      user.id,
    );

    const userUpdated = await this.userRepository.findOne({
      where: { id: userUpdatedWithToken.id },
      relations: {
        profile: { posts: true },
      },
    });

    return { user: userUpdated, token, publicKey };
  }

  async updateUserToken(privateKey: string, id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;

    if (user.privateKey) {
      return await this.userRepository.save({
        ...user,
        privateKey: privateKey,
      });
    }

    return await this.userRepository.save({ ...user, privateKey: privateKey });
  }
}
