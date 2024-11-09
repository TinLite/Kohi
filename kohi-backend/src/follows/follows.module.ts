import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
   UsersModule,
   NotificationsModule,
   EventsModule,
  ],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
