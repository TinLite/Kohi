// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  private readonly uploadPath = path.join(__dirname, '../../dest/uploads');
  constructor(){
    if(!fs.existsSync(this.uploadPath)){
      fs.mkdirSync(this.uploadPath);
    }
  }
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);
    await fs.promises.writeFile(filePath, file.buffer);
    return fileName; // Trả về tên ảnh thay vì đường dẫn 
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  }
  async deleteFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  }

  // uploadFile(file: Express.Multer.File,folder:string): Promise<CloudinaryResponse> {
  //   return new Promise<CloudinaryResponse>((resolve, reject) => {
  //     const uploadStream = cloudinary.uploader.upload_stream({folder:folder},
  //       (error, result) => {
  //         if (error) return reject(error);
  //         resolve(result);
  //       },
  //     );

  //     streamifier.createReadStream(file.buffer).pipe(uploadStream);
  //   });
  // }

  // async uploadFiles(files: Express.Multer.File[], folder: string): Promise<string[]> {
  //   const uploadPromises = files.map(file => this.uploadFile(file, folder));
  //   const uploadResults = await Promise.all(uploadPromises);
  //   return uploadResults.map(result => result.secure_url);
  // }
 
  

  // async deleteFile(publicId: string): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     cloudinary.uploader.destroy(publicId, (error, result) => {
  //       if (error) return reject(error);
  //       resolve();
  //     });
  //   });
  // }
}
