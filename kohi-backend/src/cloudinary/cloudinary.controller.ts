import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post('img')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    const folder = process.env.CLOUDINARY_FOLDER_USER;
    return this.cloudinaryService.uploadFile(file, folder);
  }
  @Post('imgs')
  @UseInterceptors(FilesInterceptor('files', 15))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const folder = process.env.CLOUDINARY_FOLDER_POST;
    const uploadData = await this.cloudinaryService.uploadFiles(files, folder);
    return uploadData;
  }
}
