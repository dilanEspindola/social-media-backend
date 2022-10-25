import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities';
import { User as UserInterface } from '../../../interface';
import { CreateUserDto } from '../../dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findUsers(): Promise<Array<UserInterface>> {
    const users = await this.usersRepository.find();
    return users;
  }

  async getUserById(userId: number): Promise<UserInterface> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        profile: { posts: true },
      },
    });
    return user;
  }

  async createUser(userData: CreateUserDto): Promise<string> {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);

    return 'user created';
  }

  async deleteUser(userId: number): Promise<string> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    await this.usersRepository.remove(user);
    return 'user deleted';
  }

  async deleteAllUsers() {
    const users = await this.usersRepository.find();
    await this.usersRepository.remove(users);
  }
}
