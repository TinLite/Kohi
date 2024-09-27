import { Logger } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(this.constructor.name);

  constructor(private authService: AuthService) { }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const authHeader = client.handshake.headers.authorization
    try {
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        const { sub: userId } = this.authService.decodeToken(token);
        if (userId) {
          this.logger.log(`Client ${client.id} authenticated as user ${userId}`);
          client.join(`user:${userId}`);
          return;
        }
      }
    } catch (e) {
      this.logger.error(`Error authenticating client ${client.id}: ${e.name} ${e.message}`);
    }
    client.disconnect(true);
  }
}
