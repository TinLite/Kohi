import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { FollowsController } from './follows.controller';

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    EventsModule,
  ],
  controllers: [FollowsController],
  providers: [],
})
export class FollowsModule { }
