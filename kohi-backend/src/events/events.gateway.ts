import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(this.constructor.name);

  constructor(private authService: AuthService) { }

  afterInit(server: Server) {
    
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Client connected: ${client.id}`);
    
    const token = client.handshake.auth?.token;
    try {
      if (token) {
        const { sub: userId } = this.authService.decodeToken(token);
        if (userId) {
          this.logger.debug(`Client ${client.id} authenticated as user ${userId}`);
          client.join(`user:${userId}`);
          return;
        } else {
          this.logger.debug(`Invalid token from client ${client.id}`);
        }
      } else {
        this.logger.debug(`No token provided by client ${client.id}`);
      }
    } catch (e) {
      this.logger.debug(`Error authenticating client ${client.id}: ${e.name} ${e.message}`);
    }
    this.logger.debug(`Client ${client.id} disconnected`);
    client.disconnect(true);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }
}
