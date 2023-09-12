import React, { ForwardRefExoticComponent, Ref, forwardRef } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { Euler, Vector3, Group, TextureLoader, BufferGeometry, Mesh, NormalBufferAttributes } from "three";
import { withCollaboration } from "./withCollaboration";
import { withXrInteractivity } from "./withXrInteractivity";

export interface ModelProps extends ForwardRefExoticComponent<Ref<Group>> {
  image: string;
  name: string;
  width: number;
  height: number;
  rotation: Euler;
  position: Vector3
}

const Model = forwardRef((props: ModelProps, group: Ref<Mesh<BufferGeometry<NormalBufferAttributes>>>) => {
  const { image, name, width, height, rotation, position } = props;
  const { gl } = useThree();
  const texture = useLoader(TextureLoader, `/images/${image}`);
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();

  return (
    <mesh ref={group} name={name} rotation={rotation} position={position}>
      <planeGeometry attach="geometry" args={[width, height]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
});

Model.displayName = 'Slide';

const InteractiveModel = withXrInteractivity(Model);
export const Slide = withCollaboration(InteractiveModel);
