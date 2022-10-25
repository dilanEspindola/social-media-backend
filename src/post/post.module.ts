import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, User } from 'src/entities';
import { PostController } from './controller/post/post.controller';
import { UsersService } from 'src/users/services/users/users.service';
import { PostService } from './service/post/post.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PostMiddleware } from './middleware/post.middleware';
// import { Token } from 'src/utils';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostController],
  providers: [PostService, CloudinaryService, UsersService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PostMiddleware).forRoutes('posts');
  }
}
