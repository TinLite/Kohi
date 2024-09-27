import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
    constructor(private readonly socket: EventsGateway) { }

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
        this.socket.server.to(`user:${userId}`).emit(event, data);
    }
}
