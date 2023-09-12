import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { Object3D, TextureLoader, DoubleSide } from "three";

export const Avatar2D = (props) => {
  const avatarMesh = useRef();
  const avatarImage = props.image === undefined ? "jamesmiller.png" : props.image;
  const texture = useLoader(TextureLoader, `/images/${avatarImage}`);

  useFrame(() => {
    const avatar: Object3D = avatarMesh.current;
    if (!avatar || props.activeUser) return;
    avatar.position.set(props.body.position.x, props.body.position.y, props.body.position.z)
    avatar.setRotationFromEuler(props.body.rotation)
  })

  return (
    <mesh ref={avatarMesh}>
      <planeGeometry attach="geometry" args={[0.5, 0.5]} />
      <meshBasicMaterial
        attach="material"
        side={DoubleSide}
        map={texture}
      />
    </mesh>
  );
};