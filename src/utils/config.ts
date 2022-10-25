import { registerAs } from '@nestjs/config';

export default registerAs('typeorm', () => ({
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
  host: process.env.HOST as string,
}));
