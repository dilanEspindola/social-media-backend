import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Res,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { CreateProfileDto } from 'src/profile/dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProfilePipe } from 'src/profile/pipes/profile.pipe';
import { ProfileService } from 'src/profile/services/profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private cloudinaryService: CloudinaryService,
    private profileServive: ProfileService,
  ) {}

  @Get()
  async getProfiles(@Res() res: Response) {
    const profiles = await this.profileServive.getAllProfiles();
    return res.status(HttpStatus.OK).json(profiles);
  }

  @Get('username')
  async getProfileByUsername(
    @Query('username') usernameProfile: string,
    @Res() res: Response,
  ) {
    try {
      const profile = await this.profileServive.getProfileByUsername(
        usernameProfile,
      );
      if (!profile)
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'USER_NOT_FOUND' });
      return res.status(HttpStatus.OK).json(profile);
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getProfile(
    @Param('id', ParseIntPipe) profileId: number,
    @Res() res: Response,
  ) {
    try {
      const profile = await this.profileServive.getProfileById(profileId);
      if (!profile)
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'user not found' });
      return res.status(HttpStatus.OK).json(profile);
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe())
  async createPrfile(
    @Body(ValidationPipe, ProfilePipe) profileData: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const { secure_url } = await this.cloudinaryService.uploadImage(file);
      const profile = await this.profileServive.createProfile({
        ...profileData,
        file: secure_url,
      });
      return res
        .status(HttpStatus.OK)
        .json({ messge: 'profile created', profile });
    } catch (error) {
      if (error.message.includes(profileData.username))
        throw new HttpException(
          'username already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      if (error.message.includes('REL_a24972ebd73b106250713dcddd'))
        throw new HttpException(
          'profile already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteProfile(
    @Param('id', ParseIntPipe) profileId: number,
    @Res() res: Response,
  ) {
    try {
      const profileDeleted = await this.profileServive.deleteProfileById(
        profileId,
      );
      return res.status(200).json({ message: profileDeleted });
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
