import React, { ReactNode, useCallback, useEffect } from "react";
import { movementStore } from "../../webgl/stores";

export const KeyboardControls = (props: { children: ReactNode; }) => {
  const { movement, setMovement } = movementStore();

  const { children } = props;

  const keyPress = useCallback((code: string, state: boolean) => {
    const moveFieldByKey = (key: string): Movement => keys[key];
    const direction = moveFieldByKey(code);
    const currentMovement: boolean = movement[direction];
    if (state !== currentMovement) setMovement(direction, state);

  }, [movement, setMovement])

  useEffect(() => {
    const handleKeyDown = (e: { code: string; }) => keyPress(e.code, true)
    const handleKeyUp = (e: { code: string; }) => keyPress(e.code, false)

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyPress]);

  return <>{children}</>;
};


export enum Movement {
  FORWARD = "forward",
  BACKWARD = "backward",
  LEFT = "left",
  RIGHT = "right",
  ROTATE_UP = "rotateUp",
  ROTATE_RIGHT = "rotateRight",
  ROTATE_DOWN = "rotateDown",
  ROTATE_LEFT = "rotateLeft",
  JUMP = "jump"
}

export interface Keys {
  KeyW: Movement.FORWARD;
  KeyS: Movement.BACKWARD;
  KeyA: Movement.LEFT;
  KeyD: Movement.RIGHT;
  ArrowUp: Movement.ROTATE_UP;
  ArrowRight: Movement.ROTATE_RIGHT;
  ArrowDown: Movement.ROTATE_DOWN;
  ArrowLeft: Movement.ROTATE_LEFT;
  Space: Movement.JUMP;
}

export const keys: Keys = {
  KeyW: Movement.FORWARD,
  KeyS: Movement.BACKWARD,
  KeyA: Movement.LEFT,
  KeyD: Movement.RIGHT,
  ArrowUp: Movement.ROTATE_UP,
  ArrowRight: Movement.ROTATE_RIGHT,
  ArrowDown: Movement.ROTATE_DOWN,
  ArrowLeft: Movement.ROTATE_LEFT,
  Space: Movement.JUMP,
};