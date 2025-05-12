import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(
    private readonly socket: EventsGateway,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(typeof this);

  announceAllClients(data: any) {
    this.socket.server.emit('events', data);
  }

  disconnectClientId(clientId: string) {
    this.socket.server.sockets[clientId].disconnect(true);
  }

  disconnectUserId(userId: string) {
    this.socket.server.to(`user:${userId}`).disconnectSockets(true);
  }

  announceToUser(userId: string, event: string, data: any) {
    this.socket.server.to(`user:${userId}`).emit(event, data, (err, res) => {
      if (err) {
        this.logger.error(`Error sending event to user ${userId}: ${err}`);
      } else {
        this.logger.log(`Event sent to user ${userId}: ${event}`);
      }
    });
  }

}
