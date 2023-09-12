import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { DataPacket } from '@shared/types';

@WebSocketGateway()
export class PositionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessageGateway');

  @WebSocketServer() wss: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  @SubscribeMessage('positions')
  async onNewMessage(@MessageBody() { type, uid, data }: DataPacket) {
    this.wss.emit('positions', {
      type,
      uid,
      data,
    });
  }
}
