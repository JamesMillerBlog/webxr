import { Matrix4 } from 'three';
import { PositionsType, UserPositionData } from '.';

export interface Packet {
  type: PositionsType;
  uid: string;
}

export interface ModelPositionData {
  submittedBy: string;
  matrixWorld: Matrix4;
}

export interface UserDataPacket extends Packet {
  data: UserPositionData;
}

export interface ModelDataPacket extends Packet {
  data: ModelPositionData;
}

export type DataPacket = UserDataPacket | ModelDataPacket;
