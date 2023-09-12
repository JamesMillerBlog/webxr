import { UserMode } from ".";

export interface CoOrdinates {
    x: number;
    y: number;
    z: number;
}

export interface PositionData {
    position: CoOrdinates;
    rotation: CoOrdinates;
}

export interface Movement {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
}

export interface Objects {
    body: PositionData;
    leftHand: PositionData;
    rightHand: PositionData;
}

export interface UserPositionData extends Objects {
    movement: Movement;
    userMode: UserMode;
}

export enum PositionsType {
    USERS = 'users',
    OBJECTS = 'objects',
}