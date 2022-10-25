import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from 'src/post/dto';
import { Post } from 'src/entities';
import { Post as PostInterface } from 'src/interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async findPosts(): Promise<Array<PostInterface>> {
    const posts = await this.postRepository.find();
    return posts;
  }

  async findPostById(id: number): Promise<PostInterface> {
    const posts = await this.postRepository.find();
    const post = posts.find((post) => post.id === id);
    return post;
  }

  async savePost(postData: CreatePostDto): Promise<PostInterface> {
    const post = this.postRepository.create(postData);
    return await this.postRepository.save(post);
  }

  async updatePost(
    postData: UpdatePostDto,
    id: number,
  ): Promise<PostInterface | null> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) return null;
    return this.postRepository.save({ ...post, ...postData });
  }

  async deletePostById(id: number): Promise<string | null> {
    const post = await this.postRepository.delete(id);
    if (post.affected === 0) return null;
    return 'post deleted';
  }
}
