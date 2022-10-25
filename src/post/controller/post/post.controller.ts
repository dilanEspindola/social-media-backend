import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PostService } from 'src/post/service/post/post.service';
import { CreatePostDto, UpdatePostDto } from 'src/post/dto';
import { PostPipe } from 'src/post/pipes';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Post as PostInterface } from 'src/interface';

@Controller('posts')
export class PostController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly postService: PostService,
  ) { }

  @Get()
  async getPosts(): Promise<Array<PostInterface>> {
    try {
      const posts = await this.postService.findPosts();
      return posts;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe) idPost: number,
    @Res() res: Response,
  ) {
    try {
      const post = await this.postService.findPostById(idPost);
      if (!post)
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'POST_NOT_FOUND' });
      return res.status(HttpStatus.OK).json(post);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe())
  async createPost(
    @Body(ValidationPipe, PostPipe)
    postData: CreatePostDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (!image) {
        const postSaved = await this.postService.savePost(postData);
        return res.status(HttpStatus.OK).json(postSaved);
      }
      const { secure_url } = await this.cloudinaryService.uploadImage(image);
      const postSaved = await this.postService.savePost({
        ...postData,
        image: secure_url,
      });
      return res.status(HttpStatus.CREATED).json(postSaved);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe())
  async updatePost(
    @Param('id', ParseIntPipe) idPost: number,
    @Body(ValidationPipe) postData: UpdatePostDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!image) {
      const post = await this.postService.updatePost(postData, idPost);
      if (!post)
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'POST_NOT_FOUND' });
      return res.status(HttpStatus.OK).json({ message: 'POST_UPDATED', post });
    }
    const { secure_url } = await this.cloudinaryService.uploadImage(image);
    const post = await this.postService.updatePost(
      { ...postData, image: secure_url },
      idPost,
    );
    if (!post)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'POST_NOT_FOUND' });
    return res.status(HttpStatus.OK).json({ message: 'POST_UPDATED', post });
  }

  @Delete(':id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const postMessage = await this.postService.deletePostById(id);

      if (!postMessage)
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'POST_NOT_FOUND' });

      return res.status(HttpStatus.OK).json({ message: 'POST_DELETED' });
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
