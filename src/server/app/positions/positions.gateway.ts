import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { UserDataPacket } from '@shared/types';
import { Server, WebSocket } from 'ws';
import { IncomingMessage } from 'http';

@WebSocketGateway()
export class PositionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('MessageGateway');

  @WebSocketServer() wss: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleDisconnect(client) {
    this.logger.log(`Client Disconnected: ${client}`);
  }

  handleConnection(client: WebSocket, req: IncomingMessage) {
    this.logger.log(`Client Connected: ${req.socket.remoteAddress}`);
  }

  @SubscribeMessage('positions')
  onEvent(_client: WebSocket, data: UserDataPacket) {
    this.wss.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
  }
}
