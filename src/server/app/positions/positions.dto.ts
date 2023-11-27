import { UserMode, PositionsType, PositionData, Movement } from '@shared/types';

export class PositionsDto {
  uid: string;
  type: PositionsType;
  data: {
    body: PositionData;
    leftHand: PositionData;
    rightHand: PositionData;
    userMode: UserMode;
    movement: Movement;
  };
}
