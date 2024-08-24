import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(), // Config
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'kohi-frontend', 'dist') // Serving build file
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
