import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  StreamableFile
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CloudinaryService } from './cloudinary.service';

@Controller('uploads')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  private readonly logger = new Logger(typeof this);
  fileRegex = /^[A-Za-z0-9-]+\.(jpg|jpeg|png|gif)$/;

  // @Post('img')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   const folder = process.env.CLOUDINARY_FOLDER_USER;
  //   return this.cloudinaryService.uploadFile(file, folder);
  // }
  // @Post('imgs')
  // @UseInterceptors(FilesInterceptor('files', 15))
  // async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
  //   const folder = process.env.CLOUDINARY_FOLDER_POST;
  //   const uploadData = await this.cloudinaryService.uploadFiles(files, folder);
  //   return uploadData;
  // }

  @Get(':id')
  async getImage(@Param('id') id: string) {
    const isValid = this.fileRegex.test(id)  
    if (!isValid) {
      this.logger.debug(`Invalid file name, Reason: Regex not matched. File name: ${id}`);
      throw new NotFoundException('File not found');
    }
    const file = createReadStream(join(process.cwd(), 'dest/uploads', id));
    file.on('error', (err) => {
      this.logger.debug(`File not found, Reason: File not found. File name: ${id}. Error: ${err}`);
      throw new NotFoundException('File not found');
    });
    return new StreamableFile(file)
  }
}
