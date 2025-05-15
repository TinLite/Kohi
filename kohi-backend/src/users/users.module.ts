import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { BookmarkService } from './bookmarks.service';
// import { FollowsService } from './follows.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RedisModule } from 'src/redis/redis.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule,
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
