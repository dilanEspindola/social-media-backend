import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  v2,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const options: UploadApiOptions = {
      public_id: file.filename,
      unique_filename: true,
      overwrite: false,
      upload_preset: 'posts_project',
    };
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}
