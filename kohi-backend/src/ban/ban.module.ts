import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ban, BanSchema } from './schema/ban.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ban.name,
        schema: BanSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [BanController],
  providers: [BanService],
})
export class BanModule {}
