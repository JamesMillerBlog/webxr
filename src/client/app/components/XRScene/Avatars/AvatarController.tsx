import React from "react";
import { Avatar2D } from ".";
import { Avatar3D } from "./Avatar3D";
import { Euler, Vector3 } from "three";
import { UserMode } from "@shared/types";

const defaultPosition = new Vector3(0, 0, 0);
const defaultRotation = new Euler();

export const AvatarController = (props) => {
  const rotation: Euler = new Euler(props.body.rotation._x, props.body.rotation._y, props.body.rotation._z, 'XYZ')

  const body = {
    position: props.body.position ? props.body.position : defaultPosition,
    rotation: props.body.rotation ? rotation : defaultRotation,
  };

  if (props.userMode === UserMode.IMAGE || props.vr && props.activeUser) {
    return (
      <Avatar2D
        body={body}
        image={props.image}
      />
    );
  } else if (props.userMode === UserMode.AVATAR && props.avatar) {

    return (
      <Avatar3D {...props} body={body} />
    )
  }
};