import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProfileController } from './controller/profile/profile.controller';
import { ProfileService } from './services/profile/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [ProfileService, CloudinaryService],
})
export class ProfileModule {}
