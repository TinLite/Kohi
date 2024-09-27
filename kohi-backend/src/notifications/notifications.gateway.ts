import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly notificationsService: NotificationsService,
    private readonly authService: AuthService

  ) {}

  afterInit(server: Server): any {
    console.log('connected');
  }
  handleConnection(client: Socket): any {
    const authHeader = client.handshake.headers.authorization;
    if(authHeader && (authHeader as string).split(' ')[1]) {
      try {
        const sub = this.authService.decodeToken((authHeader as string).split(' ')[1]);
        client.data.sub = sub;
      } catch (err) {
        client.disconnect();
      }
  }else{
      client.disconnect();
  }
}
  handleDisconnect(client: Socket): any {
    console.log('Client disconnected: ', client.id, client.data.sub); 
  }
  @SubscribeMessage('sendNotification')
  async sendNotification(content:string
  ) {
    await this.server.emit('notification', {content});
  }

}
