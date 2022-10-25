import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from 'src/entities';
import { CreateProfileDto } from 'src/profile/dto';
import { Profile as ProfileInterface } from 'src/interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async getAllProfiles(): Promise<ProfileInterface[]> {
    const profiles = await this.profileRepository.find();
    return profiles;
  }

  async getProfileByUsername(username: string): Promise<ProfileInterface> {
    const profile = await this.profileRepository.findOne({
      where: { username },
      relations: { user: true, posts: true },
    });
    return profile;
  }

  async getProfileById(id: number): Promise<ProfileInterface> {
    const profile = await this.profileRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        posts: true,
      },
    });
    return profile;
  }

  async createProfile(
    profileData: CreateProfileDto,
  ): Promise<ProfileInterface> {
    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }

  async deleteProfileById(id: number): Promise<string> {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile) return 'profile not found';
    await this.profileRepository.delete(profile);
    return 'profile deleted';
  }
}
