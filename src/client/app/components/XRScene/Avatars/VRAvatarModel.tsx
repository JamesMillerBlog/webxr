import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Object3D } from "three";

export const VRAvatarModel = (props) => {
  const { AvatarRoot, LeftHand, RightHand } = props.model;
  const group = useRef();

  useFrame(() => {
    const avatar: Object3D = group.current;
    if (!avatar || props.activeUser) return;

    const yRotation = props.body.rotation.y - 135;
    avatar.position.set(props.body.position.x, props.body.position.y, props.body.position.z)
    avatar.rotation.set(props.body.rotation.x, yRotation, props.body.rotation.z)

    if (props.leftHand && LeftHand && props.leftHand.position.x !== 0) setHandPosition(LeftHand, props.leftHand);
    else LeftHand.scale.set(0);

    if (props.rightHand && RightHand && props.rightHand.position.x !== 0) setHandPosition(RightHand, props.rightHand);
    else RightHand.scale.set(0)
  })

  return (
    <primitive
      object={AvatarRoot}
      ref={group}
    />
  );
};

export const setHandPosition = (hand, { position, rotation }) => {
  hand.position.x = position.x;
  hand.position.y = position.y;
  hand.position.z = position.z;
  hand.rotation.x = rotation.x;
  hand.rotation.y = rotation.y;
  hand.rotation.z = rotation.z;
};