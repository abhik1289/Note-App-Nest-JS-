import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryConfigService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Utility function to upload image
  async uploadImage(file: Express.Multer.File){
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'profile_photo' }, // Optional: add a folder in your Cloudinary account
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });
  }
}
