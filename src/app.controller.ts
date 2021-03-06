import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User as UserModel, Post as PostModel } from '@prisma/client';

import { PostService } from './post/post.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @Get('draft')
  async getUnPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: false },
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('serchString') serchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: serchString },
          },
          {
            content: { contains: serchString },
          },
        ],
      },
    });
  }

  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string; authorEmail: string },
  ): Promise<PostModel> {
    const { title, content } = postData;
    return this.postService.createPost({
      title,
      content,
    });
  }

  @Post('user')
  async signUpUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put('publish/:id')
  async publishPost(
    @Param('id') id: string,
    @Query('title') title: string,
  ): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { title: title },
    });
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
