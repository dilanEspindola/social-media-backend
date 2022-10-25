import { PostMiddleware } from './post.middleware';

describe('PostMiddleware', () => {
  it('should be defined', () => {
    expect(new PostMiddleware()).toBeDefined();
  });
});
