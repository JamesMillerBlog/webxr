import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Object3D } from "three";

export const VRAvatarModel = (props) => {
  const { AvatarRoot, LeftHand, RightHand, vr } = props.model;
  const group = useRef();

  useFrame(() => {
    const avatar: Object3D = group.current;
    if (!avatar || props.activeUser) return;

    avatar.position.set(props.body.position.x, props.body.position.y, props.body.position.z)
    avatar.setRotationFromEuler(props.body.rotation)

    if (!vr) {
      LeftHand.scale.set(0)
      RightHand.scale.set(0)
    } else {
      if (props.leftHand && LeftHand) setHandPosition(LeftHand, props.leftHand);
      if (props.rightHand && RightHand) setHandPosition(RightHand, props.rightHand);
    }
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